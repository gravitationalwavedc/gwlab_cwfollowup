import React, { useState } from 'react';
import {Col, Row, Nav, Tab} from 'react-bootstrap';
import { useFormik } from 'formik';
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
      result
    }
  }
`;


const FormTabs = ({ data }) => {
    const jobData = data && data.viterbiJob
    const [key, setKey] = useState(jobData ? "followups" : "uploadCandidate")
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => handleJobSubmission(values, jobData)
    })


    const handleJobSubmission = (values, jobData) => {
        // The mutation requires all number values to be strings.
        Object.entries(values)
            .filter(([key, value]) => typeof(value) === 'number')
            .map(([key, value]) => values[key] = value.toString());
        var variables = {
            input: {
                name: values.name,
                description: values.description,
                followups: values.followupChoices
                // private: false, 
            }
        };
        _.merge(
            variables,
            jobData ? {
                input: {
                    isUploaded: false,
                    viterbiJob: {
                        viterbiId: jobData.id
                    }
                }
            } :
            {
                input: {
                    isUploaded: true,
                    uploadedJob: {
                        sourceDataset: values.sourceDataset,
                        candidateFrequency: values.candidateFrequency,
                        asini: values.asini,
                        orbitTp: values.orbitTp,
                        orbitPeriod: values.orbitPeriod,
                    }
                }
            }
        )

        commitMutation(harnessApi.getEnvironment('cwfollowup'), {
            mutation: submitMutation,
            variables: variables,
            onCompleted: (response, errors) => {
                console.log(response)
                // if (!errors) {
                //     router.replace(`/viterbi/job-results/${response.newViterbiJob.result.jobId}/`);
                // }
            },
        });
    };



    return (
        <React.Fragment>
            <Row>
                <Col md={2}/>
                <Col md={8} style={{minHeight: '110px'}}>
                    <JobTitle formik={formik} />
                </Col>
            </Row>
            <Tab.Container id="jobForm" activeKey={key} onSelect={(key) => setKey(key)}>
                <Row>
                    <Col md={2}>
                        <Nav className="flex-column">
                            {
                                !jobData && 
                                <Nav.Item>
                                    <Nav.Link eventKey="uploadCandidate">
                                        <h5>Candidate</h5>
                                        <p>Specify details of candidate</p>
                                    </Nav.Link>
                                </Nav.Item>
                            }
                            <Nav.Item>
                                <Nav.Link eventKey="followups">
                                    <h5>Target Details</h5>
                                    <p>Specify details of target</p>
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
                            {
                                !jobData &&
                                <Tab.Pane eventKey="uploadCandidate">
                                    <CandidateForm formik={formik} handlePageChange={setKey}/>
                                </Tab.Pane>
                            }
                            <Tab.Pane eventKey="followups">
                                <FollowupsForm formik={formik} handlePageChange={setKey}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="review">
                                <ReviewJob 
                                    formik={formik} 
                                    values={formik.values} 
                                    handleSubmit={formik.handleSubmit}
                                />
                                {/* Hello */}
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </React.Fragment>
    )
}

export default createFragmentContainer(FormTabs,
    {
        data: graphql`
            fragment FormTabs_data on Query @argumentDefinitions(
                jobId: {type: "ID!"}
            ) {
                viterbiJob (id: $jobId) {
                    id
                    start {
                        name
                        description
                    }
                }
            }
        `
    }
)