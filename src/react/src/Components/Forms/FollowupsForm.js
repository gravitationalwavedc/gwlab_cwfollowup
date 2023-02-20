import React from 'react';
import { Col, Row } from 'react-bootstrap';
import FormCard from './FormCard';
import PageNav from './Atoms/PageNav';
import followupOptions from '../../Utils/followupOptions';
import FollowupCard from './FollowupCard';

const FollowupsForm = ({ handlePageChange }) => <React.Fragment>
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
    />
</React.Fragment>;

export default FollowupsForm;
