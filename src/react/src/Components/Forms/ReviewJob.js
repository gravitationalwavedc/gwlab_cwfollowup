import React, {useState} from 'react';
import { Col, Row } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import Parameters from '../Results/Parameters';
import PageNav from './Atoms/PageNav';

const ReviewJob = ({ handlePageChange }) => {
    const [errors, setErrors] = useState([]);
    const { values, handleSubmit, validateForm } = useFormikContext();

    const submitReview = async () => {
        const errors = await validateForm();
        setErrors(Object.keys(errors));

        if (Object.keys(errors).length === 0 && errors.constructor === Object) {
            handleSubmit();
        }
    };

    return (
        <React.Fragment>
            <Parameters candidates={values.candidates} followups={values.followupChoices} />
            {errors.length > 0 && <Row>
                <Col className="text-danger">
                    Errors are present in:
                    <ul>{errors.map(value => <li className="text-danger" key={value}>{value}</li>)}</ul>
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
