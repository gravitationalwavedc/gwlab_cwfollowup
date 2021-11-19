import React, { useState, useEffect } from 'react';
import {createPaginationContainer, graphql} from 'react-relay';
import { Button, Container, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';
import JobTable from '../Components/JobTable';
import EmptyTableMessage from './EmptyTableMessage';

const RECORDS_PER_PAGE = 100;

const PublicViterbiJobsList = ({data, match, router, relay, handleSwitch}) => {
    const [search, setSearch] = useState('');
    const [timeRange, setTimeRange] = useState('1d');
    const [order, setOrder] = useState();
    const [direction, setDirection] = useState('descending');

    useEffect(() => handleSearchChange(), [search, timeRange, direction, order]);

    const handleSearchChange = () => {
        const refetchVariables = {
            count: RECORDS_PER_PAGE,
            search: search,
            timeRange: timeRange,
            orderBy: order,
            direction: direction
        };
        relay.refetchConnection(1, null, refetchVariables);
    };

    const loadMore = () => {
        if (relay.hasMore()) {
            relay.loadMore(RECORDS_PER_PAGE);
        }
    };

    const timeOptions = [
        {text: 'Any time', value: 'all'},
        {text: 'Past 24 hours', value: '1d'},
        {text: 'Past week', value: '1w'},
        {text: 'Past month', value: '1m'},
        {text: 'Past year', value: '1y'},
    ];

    return (
        <Container>
            <h4 className="pt-5 pt-md-5 mb-0">
                Public Viterbi Jobs
            </h4>
            <Form>
                <Form.Row>
                    <Col lg={3}>
                        <Form.Group controlId="searchJobs">
                            <Form.Label srOnly>
                                Search
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <HiOutlineSearch />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control 
                                    placeholder="Find a job..." 
                                    value={search} 
                                    onChange={({target}) => setSearch(target.value)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col lg={3}>
                        <Form.Group controlId="timeRange">
                            <Form.Label srOnly>
                                Time
                            </Form.Label>
                            <Form.Control 
                                as="select" 
                                value={timeRange} 
                                onChange={({target}) => setTimeRange(target.value)} 
                                custom>
                                {timeOptions.map(option => 
                                    <option 
                                        key={option.value} 
                                        value={option.value}>
                                        {option.text}
                                    </option>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col lg={4} xs={10}>
                        <Button 
                            onClick={handleSwitch}
                            variant="outline-primary"
                            className="mr-1"
                            data-testid="user-jobs-button"
                        >
                            Show My Viterbi Jobs
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <Row>
                <Col>
                    {data.viterbi.publicViterbiJobs.edges.length > 0 ? <JobTable
                        data={data.viterbi.publicViterbiJobs}
                        setOrder={setOrder}
                        order={order} 
                        setDirection={setDirection} 
                        direction={direction}
                        match={match}
                        router={router}
                        hasMore={relay.hasMore()}
                        loadMore={loadMore}
                        toFollowup
                    /> : <EmptyTableMessage/>}
                </Col>
            </Row>
        </Container>
    );
};

export default createPaginationContainer(PublicViterbiJobsList,
    {
        data: graphql`
            fragment PublicViterbiJobsList_data on Query {
                viterbi {
                    publicViterbiJobs (
                        first: $count,
                        after: $cursor,
                        search: $search,
                        timeRange: $timeRange
                    ) @connection(key: "PublicViterbiJobsList_publicViterbiJobs") {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        edges {
                            node {
                                id
                                name
                                description
                                jobStatus {
                                    name
                                }
                                labels {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        `,
    },
    {
        direction: 'forward',
        query: graphql`
            query PublicViterbiJobsListForwardQuery(
                $count: Int!,
                $cursor: String,
                $search: String,
                $timeRange: String
            ) {
                ...PublicViterbiJobsList_data
            }
        `,

        getConnectionFromProps(props) {
            return props.data && props.data.viterbi.publicViterbiJobs;
        },

        getFragmentVariables(previousVariables, totalCount) {
            return {
                ...previousVariables,
                count: totalCount
            };
        },
        getVariables(props, {count, cursor}, {}) {
            return {
                count,
                cursor
            };
        }
    }
);
