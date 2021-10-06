import React, {useState} from 'react';
import {Button, Col, Row, Table,} from 'react-bootstrap';
import FormCard from './FormCard';
import { useFormikContext } from 'formik';

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
            <Row>
                <Col>
                    <FormCard title="Candidate Parameters">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Candidate Frequency (Hz)</th>
                                    <td className="text-right">{values.candidateFrequency}</td>
                                </tr>
                                <tr>
                                    <th>Source Dataset</th>
                                    <td className="text-right">{values.sourceDataset}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                    {
                        values.targetBinary &&
                        <FormCard title="Target Parameters">
                            <Table>
                                <tbody>
                                    <tr>
                                        <th>Orbit projected semi-major axis (a sin i, seconds)</th>
                                        <td className="text-right">{values.asini}</td>
                                    </tr>
                                    <tr>
                                        <th>Time of ascension (GPS s)</th>
                                        <td className="text-right">{values.orbitTp}</td>
                                    </tr>
                                    <tr>
                                        <th>Orbital period (s)</th>
                                        <td className="text-right">{values.orbitPeriod}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </FormCard>
                    }
                    <FormCard title="Followups">
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Followups</th>
                                    <td className="text-right">{values.followupChoices}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </FormCard>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col md={3}>
                    <Button onClick={submitReview}>Submit your job</Button>
                </Col>
                <Col>
                    <ul>{errors.map(value => <li className="text-danger" key={value}>{value}</li>)}</ul>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ReviewJob;
