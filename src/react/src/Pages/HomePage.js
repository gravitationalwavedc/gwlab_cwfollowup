import React from 'react';
import Link from 'found/Link';
import { Container, Button, Row, Col } from 'react-bootstrap';
import HomeBanner from '../Components/HomeBanner';

const HomePage = ({ match, router }) => (
    <Container fluid className="banner d-none d-sm-block">
        <HomeBanner match={match} router={router} />
    </Container>
);

export default HomePage;
