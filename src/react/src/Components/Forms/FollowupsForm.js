import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import FormCard from './FormCard';
import CheckGroup from './Atoms/CheckGroup';

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
            <Row>
                <Col>
                    <Button onClick={() => handlePageChange('review')}>Save and continue</Button>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default FollowupsForm;
