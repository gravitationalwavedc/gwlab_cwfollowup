import React, { useState, useEffect } from 'react';
import {createPaginationContainer, graphql} from 'react-relay';
import { Button, Container, Col, Form, InputGroup, Navbar, Row } from 'react-bootstrap';
import { HiOutlineSearch } from 'react-icons/hi';
import Link from 'found/Link';
import JobTable from '../Components/JobTable';
import EmptyTableMessage from '../Components/EmptyTableMessage';

const RECORDS_PER_PAGE = 100;

const PublicJobs = ({data, match, router, relay}) => {
    const [search, setSearch] = useState('');
    const [timeRange, setTimeRange] = useState('all');
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
        <Container >
            <h4 className="pt-5 pt-md-5 mb-0">
                Public Followups
            </h4>
            <Form>
                <Form.Row>
                    <Col lg={4}>
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
                                    placeholder="Search..." 
                                    value={search} 
                                    onChange={({target}) => setSearch(target.value)} />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
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
                        <Link 
                            as={Button}
                            variant="outline-primary"
                            to='/cwfollowup/my-jobs/' 
                            exact 
                            match={match} 
                            router={router} 
                            className="mr-1">
                                    View my followups
                        </Link>
                    </Col>
                </Form.Row>
            </Form>
            <Row>
                <Col>
                    { data.publicCwfollowupJobs.edges.length > 0 ? <JobTable
                        data={data.publicCwfollowupJobs}
                        setOrder={setOrder} 
                        order={order} 
                        setDirection={setDirection} 
                        direction={direction}
                        match={match}
                        router={router}
                        hasMore={relay.hasMore()}
                        loadMore={loadMore}
                    /> : <EmptyTableMessage/>}
                </Col>
            </Row>
            <Navbar fixed="bottom" className="justify-content-center d-sm-none top-shadow">
                <Link as={Button} to='/cwfollowup/job-form/' exact match={match} router={router}>
                                New followup
                </Link>
            </Navbar>
        </Container>
    );
};

export default createPaginationContainer(PublicJobs,
    {
        data: graphql`
            fragment PublicJobs_data on Query {
                publicCwfollowupJobs(
                    first: $count,
                    after: $cursor,
                    search: $search,
                    timeRange: $timeRange
                ) @connection(key: "PublicJobs_publicCwfollowupJobs") {
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                    edges {
                        node {
                            id
                            user
                            name
                            description
                            jobStatus {
                              name
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
            query PublicJobsForwardQuery(
                $count: Int!,
                $cursor: String,
                $search: String,
                $timeRange: String
            ) {
              ...PublicJobs_data
            }
        `,

        getConnectionFromProps(props) {
            return props.data && props.data.publicCwfollowupJobs;
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
