import React, { useState } from 'react';
import {Col, Row, Nav, Tab} from 'react-bootstrap';
import { Formik, Form } from 'formik';
import JobTitle from './JobTitle';
import CandidateForm from './CandidateForm';
import FollowupsForm from './FollowupsForm';
import ReviewJob from './ReviewJob';
import initialValues from './initialValues';
import validationSchema from './validationSchema';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay';
import _ from "lodash";
import { harnessApi } from '../../index';

const submitMutation = graphql`
    mutation FormTabsNewJobMutation($input: CWFollowupJobMutationInput!) {
        newCwfollowupJob(input: $input) {
            result {
                jobId
            }
        }
    }
`;


const FormTabs = ({ data, match }) => {
    const viterbiId = match.location.state && match.location.state.jobId
    const jobData = data && data.viterbi.viterbiJob
    const candidateData = data && data.viterbiJobCandidates

    if (jobData) {
        initialValues.name = `Followup-of-${jobData.start.name}`
        initialValues.description = `Followup job of ${jobData.start.name}. Original description: ${jobData.start.description}`
    }
    if (candidateData) {
        initialValues.candidates = candidateData.map(candidate => ({
            ...candidate,
            targetBinary: true
        }))
    }

    const [key, setKey] = useState("candidates")


    const handleJobSubmission = (values, viterbiId) => {
        // The mutation requires all number values to be strings.
        const json = JSON.stringify(values);
        values = JSON.parse(json, (key, val) => (
            typeof(val) === 'number' && val !== null ? val.toString() : val
        ));
        var variables = {
            input: {
                name: values.name,
                description: values.description,
                isUploaded: viterbiId ? false : true,
                viterbiId: viterbiId,
                candidates: values.candidates.map(({targetBinary, ...candidate}) => 
                    candidate
                ),
                followups: values.followupChoices,
            }
        };

        commitMutation(harnessApi.getEnvironment('cwfollowup'), {
            mutation: submitMutation,
            variables: variables,
            onCompleted: (response, errors) => {
                console.log(response)
                if (!errors) {
                    router.replace(`/cwfollowup/job-results/${response.newCwFollowupJob.result.jobId}/`);
                }
            },
        });
    };



    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleJobSubmission(values, viterbiId)}
        >
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
                                    <Nav.Link eventKey="candidates">
                                        <h5>Candidate</h5>
                                        <p>Specify details of candidate</p>
                                    </Nav.Link>
                                </Nav.Item>
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
                                <Tab.Pane eventKey="candidates">
                                    <CandidateForm handlePageChange={setKey}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="followups">
                                    <FollowupsForm handlePageChange={setKey}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="review">
                                    <ReviewJob />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Form>
        </Formik>
    )
}

export default createFragmentContainer(FormTabs,
    {
        data: graphql`
            fragment FormTabs_data on Query @argumentDefinitions(
                jobId: {type: "ID!"}
            ) {
                viterbi {
                    viterbiJob (id: $jobId) {
                        id
                        start {
                            name
                            description
                        }
                    }
                }
                viterbiJobCandidates (jobId: $jobId) {
                    orbitPeriod
                    asini
                    orbitTp
                    candidateFrequency
                    sourceDataset
                }
            }
        `
    }
)