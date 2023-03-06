import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import { Row, Nav, Col, Container, Tab } from 'react-bootstrap';
import Files from '../Components/Results/Files';
import Parameters from '../Components/Results/Parameters';
import JobHeading from '../Components/JobHeading';
import Error404 from '../Error404';

const ViewJob = (props) => {
    const jobData = props.data && props.data.cwfollowupJob;
    return <>
        {jobData ? <><JobHeading jobData={jobData}/> 
            <Container className="form-container pb-5 pt-5" fluid>
                <Container>
                    <Tab.Container id="jobResultsTabs" defaultActiveKey="parameters">
                        <Row>
                            <Col md={2}>
                                <Nav className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="parameters">
                                            <p className="text-button">Parameters</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="results">
                                            <p className="text-button">Results</p>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col md={8}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="parameters">
                                        <Parameters candidateGroup={jobData.candidateGroup} followups={jobData.followups}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="results">
                                        <Files jobId={jobData.id} {...props}/>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    <Files jobId={jobData.id} {...props} hidden style={{display:'none'}}/>
                </Container>
            </Container></>
            : <Error404 message="Job not found"/>}
    </>;
};

export default createFragmentContainer(ViewJob,
    {
        data: graphql`
            fragment ViewJob_data on Query @argumentDefinitions(
                jobId: {type: "ID!"}
            ){
                cwfollowupJob (id: $jobId) {
                    id
                    userId
                    lastUpdated
                    start {
                        name
                        description
                        ...PrivacyToggle_data
                    }
                    jobStatus {
                        name
                        number
                        date
                    }
                    candidateGroup {
                        name
                        description
                        nCandidates
                    }
                    followups
                }
            }
        `,
    },
);
