import React, { useState } from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import {harnessApi} from '../index';
import { Container, Col, Row, Tab, Nav, Button } from 'react-bootstrap';
import PublicViterbiJobsList from '../Components/PublicViterbiJobsList';
import UserViterbiJobsList from '../Components/UserViterbiJobsList';

const ViterbiJobLists = (props) => {
    const [publicJobs, setPublicJobs] = useState(true)


    return (
        <Container>
            <h2 className="pt-5 mb-4">
            {publicJobs ? "Public Viterbi Jobs" : "My Viterbi Jobs"}
                <span className="float-right">
                    <Button 
                        onClick={() => setPublicJobs(!publicJobs)}
                        variant="outline-primary"
                        className="mr-1"
                    >
                        {publicJobs ? "Switch to My Jobs" : "Switch to Public Jobs"}
                    </Button>
                </span>
            </h2>
            {
                publicJobs ? <PublicViterbiJobsList {...props} />
                :  <UserViterbiJobsList {...props} />
            }
        </Container>
    )
}

export default createFragmentContainer(ViterbiJobLists,
    {
        data: graphql`
            fragment ViterbiJobLists_data on Query {
                ...PublicViterbiJobsList_data
                ...UserViterbiJobsList_data
            }
        `,
    },
);