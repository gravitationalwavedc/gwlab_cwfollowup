import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import FormCard from './FormCard';
import CheckGroup from './Atoms/CheckGroup';
import PageNav from './Atoms/PageNav';
import followupOptions from '../../Utils/followupOptions'
import FollowupCard from './FollowupCard';

const FollowupsForm = ({handlePageChange}) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <FormCard title="Followups">
                        <Row>
                            <Col>
                                {
                                    followupOptions.map(followup => (
                                        <FollowupCard
                                            name="followupChoices"
                                            key={name + followup.label}
                                            {...followup}
                                        />
                                    ))
                                }
                            </Col>
                        </Row>
                    </FormCard>
                </Col>
            </Row>
            <PageNav
                handlePageChange={handlePageChange}
                forward={{key: 'review', label: 'Review and Submit'}}
                backward={{key: 'candidates', label: 'Candidates'}}
            />
        </React.Fragment>
    );
};

export default FollowupsForm;
