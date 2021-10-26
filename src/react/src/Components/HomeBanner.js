import React from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import Link from 'found/Link';

const HomeBanner = ({match, router}) => 
    <>
        <Container fluid className="banner d-none d-sm-block">
            <Container>
                <Row>
                    <Col xs={12}>
                        <h1 className="title-display"> CWFollowup</h1>
                    </Col>
                    <Col md={8} className="mb-4">
                        <h5>
                            Perform followups to the results of continuous wave searches.
                        </h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Link as={Button} to='/cwfollowup/new-job/' exact match={match} router={router}>
                                New experiment
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    </>;

export default HomeBanner;
