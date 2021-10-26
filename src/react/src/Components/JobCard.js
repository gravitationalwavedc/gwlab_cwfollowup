import React from 'react';
import { Card } from 'react-bootstrap';
import Link from 'found/Link';
import { HiDuplicate, HiTrash, HiDocumentText} from 'react-icons/hi';

const JobCard = ({node, match, router, toFollowup}) =>
    <Card className="gwlab-job-card">
        <Card.Body>
            <Card.Title>
                {node.name} 
            </Card.Title>
            <Card.Subtitle>{node.description}</Card.Subtitle>
            <Card.Text>
                <span className={`status-${node.jobStatus.name.toLowerCase()}`}>
                    {node.jobStatus.name}
                </span>
                {node.user}
            </Card.Text>
        </Card.Body>
        {
            toFollowup ? 
            <Card.Footer className="text-right">
                <Link 
                    to={{
                        pathname: '/cwfollowup/new-job/job-form/',
                        state: {
                            jobId: node.id
                        }
                    }}
                    activeClassName="selected" 
                    className="card-action"
                    exact 
                    match={match} 
                    router={router}>
                    <HiDocumentText className="mr-1 mb-1" />
                        Follow Up
                </Link>
            </Card.Footer> :
            <Card.Footer className="text-right">
                <Link 
                    to={{pathname: '/cwfollowup/job-results/' + node.id + '/'}} 
                    activeClassName="selected" 
                    className="card-action"
                    exact 
                    match={match} 
                    router={router}>
                    <HiDocumentText className="mr-1 mb-1" />
                        View
                </Link>
            </Card.Footer>
        }
    </Card>;

export default JobCard;
