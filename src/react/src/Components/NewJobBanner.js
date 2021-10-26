import React from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import Link from 'found/Link';

const NewJobBanner = ({match, router}) => 
    <>
        <Container fluid className="banner d-none d-sm-block">
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2> New Job</h2>
                    </Col>
                    <Col md={8} className="mb-4">
                        <h5>
                            Followups can be run on existing jobs from the Viterbi module,
                            or on uploaded candidates from other continuous wave search codes.
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Link as={Button} to='/cwfollowup/new-job/job-form' exact match={match} router={router}>
                                Upload Candidates
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    </>;

export default NewJobBanner;
