import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import { Container } from 'react-bootstrap';
import ViterbiJobLists from '../Components/ViterbiJobLists';
import NewJobBanner from '../Components/NewJobBanner';


const NewJob = ({ match, router, ...props}) => {
    
    return (
        <React.Fragment>
            <NewJobBanner match={match} router={router} />
            <Container>
                <ViterbiJobLists match={match} router={router} {...props}/>
            </Container>
        </React.Fragment>
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