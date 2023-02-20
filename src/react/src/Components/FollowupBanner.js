import React from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import Link from 'found/Link';

const FollowupBanner = ({title, match, router}) => <>
    <Container fluid className="banner d-none d-sm-block">
        <Container>
            <Row>
                <Col xs={12}>
                    <h1 className="title-display">{title}</h1>
                </Col>
                <Col md={8} className="mb-4">
                    <h5>
                        Perform followups on candidates created by continuous wave searches. <br />
                        Candidates are created with and stored in the GWCandidate module. <br />
                        Select the desired group of candidates in order to run followup scripts on them.
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link as={Button} to='/gwcandidate/candidate-groups/' exact match={match} router={router}>
                        View Candidate Groups
                    </Link>
                </Col>
            </Row>
        </Container>
    </Container>
</>;

export default FollowupBanner;
