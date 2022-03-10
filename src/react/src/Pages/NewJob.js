import React from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import ViterbiJobLists from '../Components/ViterbiJobLists';
import NewJobBanner from '../Components/NewJobBanner';


const NewJob = ({ match, router, ...props}) => (
    <>
        <NewJobBanner match={match} router={router} />
        <ViterbiJobLists match={match} router={router} {...props}/>
    </>
);

export default createFragmentContainer(NewJob,
    {
        data: graphql`
            fragment NewJob_data on Query {
                ...ViterbiJobLists_data
            }
        `,
    },
);