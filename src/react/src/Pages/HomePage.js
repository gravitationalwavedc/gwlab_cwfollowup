import React from 'react';
import FollowupBanner from '../Components/FollowupBanner';

const HomePage = ({ match, router }) => (
    <FollowupBanner title='CWFollowup' match={match} router={router} />
);

export default HomePage;
