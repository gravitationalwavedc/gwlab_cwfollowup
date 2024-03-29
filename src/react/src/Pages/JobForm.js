import React, { useState } from 'react';
import {Col, Row, Nav, Tab, Container} from 'react-bootstrap';
import { Formik, Form } from 'formik';
import JobTitle from '../Components/Forms/JobTitle';
import FollowupsForm from '../Components/Forms/FollowupsForm';
import ReviewJob from '../Components/Forms/ReviewJob';
import initialValues from '../Components/Forms/initialValues';
import validationSchema from '../Components/Forms/validationSchema';
import { graphql, commitMutation, createFragmentContainer } from 'react-relay';
import { harnessApi } from '../index';

const submitMutation = graphql`
    mutation JobFormNewJobMutation($input: CWFollowupJobMutationInput!) {
        newCwfollowupJob(input: $input) {
            result {
                jobId
            }
        }
    }
`;


const JobForm = ({ data, router }) => {
    const [key, setKey] = useState('followups');

    const {candidateGroup} = data;

    const handleJobSubmission = (values) => {
        // The mutation requires all number values to be strings.
        const json = JSON.stringify(values);
        values = JSON.parse(json, (key, val) => (
            typeof(val) === 'number' && val !== null ? val.toString() : val
        ));

        var variables = {
            input: {
                name: values.name,
                description: values.description,
                followups: values.followupChoices,
                candidateGroupId: candidateGroup.id
            }
        };

        commitMutation(harnessApi.getEnvironment('cwfollowup'), {
            mutation: submitMutation,
            variables: variables,
            onCompleted: (response, errors) => {
                console.log(response);
                if (!errors) {
                    router.replace(`/cwfollowup/job-results/${response.newCwfollowupJob.result.jobId}/`);
                }
            },
        });
    };



    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleJobSubmission(values)}
        >
            <Container fluid>
                <Form>
                    <Row>
                        <Col md={2}/>
                        <Col md={8} style={{minHeight: '110px'}}>
                            <JobTitle />
                        </Col>
                    </Row>
                    <Tab.Container id="jobForm" activeKey={key} onSelect={(key) => setKey(key)}>
                        <Row>
                            <Col md={2}>
                                <Nav className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="followups">
                                            <h5>Followups</h5>
                                            <p>Specify which followups should be run</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="review">
                                            <h5>Review</h5>
                                            <p>Finalise and start your job</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col md={8}>
                                <Tab.Content>
                                    <Tab.Pane data-testid="followupsPane" eventKey="followups">
                                        <FollowupsForm handlePageChange={setKey}/>
                                    </Tab.Pane>
                                    <Tab.Pane data-testid="reviewPane" eventKey="review">
                                        <ReviewJob candidateGroup={candidateGroup} handlePageChange={setKey}/>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Form>
            </Container>
        </Formik>
    );
};

export default createFragmentContainer(JobForm,
    {
        data: graphql`
            fragment JobForm_data on Query @argumentDefinitions(
                groupId: {type: "ID!"}
            ){
                candidateGroup (groupId: $groupId) {
                    id
                    name
                    description
                    nCandidates
                }
            }
        `,
    },
);