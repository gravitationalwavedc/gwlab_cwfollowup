import React, { useState } from 'react';
import {graphql, createFragmentContainer} from 'react-relay';
import PublicViterbiJobsList from '../Components/PublicViterbiJobsList';
import UserViterbiJobsList from '../Components/UserViterbiJobsList';

const ViterbiJobLists = (props) => {
    const [publicJobs, setPublicJobs] = useState(true);

    return (
        <React.Fragment>
            {
                publicJobs ? <PublicViterbiJobsList {...props} handleSwitch={() => setPublicJobs(false)}/>
                    :  <UserViterbiJobsList {...props} handleSwitch={() => setPublicJobs(true)}/>
            }
        </React.Fragment>
    );
};

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