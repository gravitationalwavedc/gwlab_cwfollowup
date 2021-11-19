import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import FormCard from './FormCard';
import CheckGroup from './Atoms/CheckGroup';
import PageNav from './Atoms/PageNav';

const FollowupsForm = ({handlePageChange}) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <FormCard title="Followups">
                        <Row>
                            <Col>
                                <CheckGroup
                                    title="Followups"
                                    name="followupChoices"
                                    options={[
                                        {label:'Lines', value: 'lines'},
                                    ]}
                                />
                            </Col>
                        </Row>
                    </FormCard>
                </Col>
            </Row>
            <PageNav
                handlePageChange={handlePageChange}
                forward={{key:'review', label:'Review and Submit'}}
                backward={{key: 'candidates', label: 'Candidates'}}
            />
        </React.Fragment>
    );
};

export default FollowupsForm;
