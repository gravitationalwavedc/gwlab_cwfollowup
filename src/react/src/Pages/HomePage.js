import React from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import Link from 'found/Link';
import { Container, Button } from 'react-bootstrap';

const HomePage = ({ router, ...match }) => {
    return (
        <Container>
            <Link as={Button} to='/cwfollowup/new-job/' exact match={match} router={router}>
                <HiOutlinePlus size={18} className="mb-1 mr-1"/>
                Start a new job 
            </Link>
            <div>This will contain the CWFollowup job list</div>
        </Container>
    )
}

export default HomePage;
