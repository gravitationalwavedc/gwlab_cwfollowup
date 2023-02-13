import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import Parameters from '../Results/Parameters';
import PageNav from './Atoms/PageNav';

const ReviewJob = ({ candidateGroup, handlePageChange }) => {
    const { values, errors, handleSubmit, validateForm } = useFormikContext();
    const errorKeys = Object.keys(errors);

    const submitReview = async () => {
        const errors = await validateForm();  // Final check
        if (Object.keys(errors).length === 0) {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            <Parameters candidateGroup={candidateGroup} followups={values.followupChoices} />
            {errorKeys.length > 0 && <Row>
                <Col className="text-danger">
                    Errors are present in:
                    <ul>{errorKeys.map(value => <li className="text-danger" key={value}>{value}</li>)}</ul>
                </Col>
            </Row>}
            <PageNav
                handlePageChange={handlePageChange}
                backward={{key: 'followups', label: 'Followups'}}
                forward={{key: 'submit', label: 'Submit'}}
                handleSubmit={submitReview}/>
        </React.Fragment>
    );
};

export default ReviewJob;
