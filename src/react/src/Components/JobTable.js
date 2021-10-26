import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import JobCard from './JobCard';

const JobTable = ({ data, match, router, hasMore, loadMore, toFollowup }) => (
    <InfiniteScroll
        dataLength={data.edges.length}
        next={loadMore}
        hasMore={hasMore}
        loader='Scroll to load more...'
        className="jobs-container"
        >
        {data.edges.map(({node}) => 
            <JobCard key={node.id} node={node} match={match} router={router} toFollowup={toFollowup}/>)
        }
    </InfiniteScroll>);

export default JobTable;

