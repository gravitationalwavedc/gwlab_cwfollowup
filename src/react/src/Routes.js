import React from 'react';
import {Route} from 'found';
import {graphql} from 'react-relay';
import {harnessApi} from './index';
import JobForm from './Pages/JobForm';
import Loading from './Components/Loading';
import {RedirectException} from 'found';
import MyJobs from './Pages/MyJobs';
import PublicJobs from './Pages/PublicJobs';
import ViewJob from './Pages/ViewJob';
import HomePage from './Pages/HomePage';

const handleRender = ({Component, props}) => {
    if (!Component || !props)
        return <Loading/>;

    if (!harnessApi.hasAuthToken())
        throw new RedirectException('/auth/?next=' + props.match.location.pathname);
    
    return <Component data={props} {...props}/>;
};

function getRoutes() {
    return (
        <Route>
            <Route
                Component={HomePage}
                environment={harnessApi.getEnvironment('cwfollowup')}
                render={handleRender}/>
            <Route
                path="public-jobs/"
                Component={PublicJobs}
                query={graphql`
                query Routes_HomePage_Query (
                  $count: Int!,
                  $cursor: String,
                  $search: String,
                  $timeRange: String,
                ) {
                    ...PublicJobs_data
                }
              `}
                prepareVariables={() => ({
                    timeRange: 'all',
                    count: 100
                })}
                environment={harnessApi.getEnvironment('cwfollowup')}
                render={handleRender}/>
            <Route
                path="new-job/"
                query={graphql`
                    query Routes_JobForm_Query ($groupId: ID!) {
                      ...JobForm_data @arguments(groupId: $groupId)
                    }
                `}
                prepareVariables={(_, match) => ({
                    groupId: match.location.state.candidateGroupId
                })}
                Component={JobForm}
                environment={harnessApi.getEnvironment('cwfollowup')}
                render={handleRender}
            />
            <Route
                path="my-jobs/"
                query={graphql`
                    query Routes_JobList_Query(
                      $count: Int!,
                      $cursor: String,
                      $orderBy: String
                    ) {
                      ...MyJobs_data
                    }
                `}
                prepareVariables={() => ({
                    count: 100,
                    timeRange: 'all',
                })}
                environment={harnessApi.getEnvironment('cwfollowup')}
                Component={MyJobs}
                render={handleRender}/>
            <Route
                path="job-results/:jobId/"
                environment={harnessApi.getEnvironment('cwfollowup')}
                Component={ViewJob}
                query={graphql`
                    query Routes_ViewJob_Query ($jobId: ID!){
                      ...ViewJob_data @arguments(jobId: $jobId)
                    }
                `}
                prepareVariables={(params) => ({
                    jobId: params.jobId
                })}
                render={handleRender}
            />
        </Route>
    );
}

export default getRoutes;
