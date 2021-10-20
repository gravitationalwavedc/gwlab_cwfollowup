import React, {useState} from 'react';
import {Button, Col, Row, Table,} from 'react-bootstrap';
import FormCard from './FormCard';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import Parameters from '../Results/Parameters';

const ReviewJob = () => {
    const [errors, setErrors] = useState([]);
    const { values, handleSubmit, validateForm } = useFormikContext()

    const submitReview = async () => {
        const errors = await validateForm();
        setErrors(Object.values(errors));

        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            <Parameters candidates={values.candidates} followups={values.followupChoices} />
            <Row className="mb-5">
                <Col md={3}>
                    <Button onClick={submitReview}>Submit your job</Button>
                </Col>
                <Col>
                    <ul>{errors.map(value => <li className="text-danger" key={value}>{value}</li>)}</ul>
                </Col>
            </Row>
        </React.Fragment>
    )
};

export default ReviewJob;
