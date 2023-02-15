import React from 'react';
import { Container } from 'react-bootstrap';
import HomeBanner from '../Components/HomeBanner';

const HomePage = ({ match, router }) => (
    <Container fluid className="banner d-none d-sm-block">
        <HomeBanner match={match} router={router} />
    </Container>
);

export default HomePage;
