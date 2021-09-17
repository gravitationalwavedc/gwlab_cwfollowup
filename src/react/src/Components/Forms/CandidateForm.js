import React from 'react';
import {Button, Col, Row} from 'react-bootstrap';
import FormCard from './FormCard';
import Input from './Atoms/Input';
import RadioGroup from './Atoms/RadioGroup';
import Switch from './Atoms/Switch';

const CandidateForm = ({formik, handlePageChange}) => {
    return (
        <React.Fragment>
            <Row>
                <Col>
                    <FormCard title="Candidate Details">
                        <Row>
                            <Col>
                                <Input
                                    formik={formik}
                                    title="Frequency of candidate (Hz)"
                                    name="candidateFrequency"
                                    type="number"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <RadioGroup
                                    title="Data" 
                                    formik={formik} 
                                    name="sourceDataset" 
                                    options={[
                                        {label:'O1', value: 'o1'},
                                        {label:'O2', value: 'o2'},
                                        {label:'O3', value: 'o3'},
                                        {label:'O4', value: 'o4'},
                                    ]}
                                    inline
                                />
                            </Col>
                        </Row>
                    </FormCard>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormCard title="Target Details">
                        <Row>
                            <Col>
                                <Switch
                                    title="Is the target a binary?" 
                                    formik={formik} 
                                    name="targetBinary"
                                    labelOn="Yes"
                                    labelOff="No"
                                />
                            </Col>
                        </Row>
                        {
                            formik.values['targetBinary'] &&
                            <React.Fragment>
                                <Row>
                                    <Col>
                                        <Input
                                            formik={formik}
                                            title="Orbital period (s)"
                                            name="orbitPeriod"
                                            type="number"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Input
                                            formik={formik}
                                            title="Orbit projected semi-major axis (a sin i, seconds)"
                                            name="asini"
                                            type="number"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Input
                                            formik={formik}
                                            title="Time of ascension (GPS s)"
                                            name="orbitTp"
                                            type="number"
                                        />
                                    </Col>
                                </Row>
                            </React.Fragment>
                        }
                    </FormCard>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={() => handlePageChange('followups')}>Save and continue</Button>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CandidateForm;
