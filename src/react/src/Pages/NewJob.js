import React, { useState } from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {harnessApi} from '../index';
import { Container, Col, Row, Tab, Nav, Button } from 'react-bootstrap';
import ViterbiJobLists from '../Components/ViterbiJobLists';
import Link from 'found/Link';

const NewJob = (props) => {
    
    return (
        <Container>
            <h1>
                New Job
            </h1>
            <Link 
                as={Button}
                variant="outline-primary"
                to='/cwfollowup/new-job/job-form/' 
                exact 
                match={props.match} 
                router={props.router} 
                className="mr-1">
                    Upload Candidate
            </Link>
            <ViterbiJobLists {...props}/>
        </Container>
    )
}

export default createFragmentContainer(NewJob,
    {
        data: graphql`
            fragment NewJob_data on Query {
                ...ViterbiJobLists_data
            }
        `,
    },
);