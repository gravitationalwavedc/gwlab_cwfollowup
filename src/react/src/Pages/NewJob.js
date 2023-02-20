import React from 'react';
import JobForm from './JobForm';
import FollowupBanner from '../Components/FollowupBanner';


const NewJob = ({ data, match, router }) => match.location.state && match.location.state.candidateGroupId
    ? <JobForm data={data} match={match} router={router}/>
    : <FollowupBanner title='New Job' match={match} router={router}/>;

export default NewJob;