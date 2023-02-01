import React from 'react';
import NewJobBanner from '../Components/NewJobBanner';


const NewJob = ({ match, router }) => (
    <>
        <NewJobBanner match={match} router={router} />
    </>
);

export default NewJob;