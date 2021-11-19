import React from 'react';
import {Button, Col, Row, Table} from 'react-bootstrap';
import Input from './Atoms/Input';
import Switch from './Atoms/Switch';
import Select from './Atoms/Select';
import { FieldArray, useFormikContext, getIn } from 'formik';
import initialValues from './initialValues';
import { HiOutlineX, HiOutlinePlus } from 'react-icons/hi'
import PageNav from './Atoms/PageNav';

const CandidateForm = ({handlePageChange}) => {
    const { values } = useFormikContext()
    return (
        <React.Fragment>
            <Table>
                <thead>
                    <tr>
                        <th>Frequency (Hz)</th>
                        <th>Observing Run</th>
                        <th>Is Binary?</th>
                        <th>Orbital Period (s)</th>
                        <th>Projected semi-major axis</th>
                        <th>Time of ascension (GPS s)</th>
                    </tr>
                </thead>
                <FieldArray
                    name="candidates"
                    render={({ push, remove }) => (
                        <tbody>
                            {
                                values.candidates.map((candidate, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Input
                                                name={`candidates.${index}.candidateFrequency`}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            <Select
                                                name={`candidates.${index}.sourceDataset`} 
                                                options={[
                                                    {label:'O1', value: 'o1'},
                                                    {label:'O2', value: 'o2'},
                                                    {label:'O3', value: 'o3'},
                                                    {label:'O4', value: 'o4'},
                                            ]}  
                                            />
                                        </td>
                                        <td>
                                            <Switch
                                                name={`candidates.${index}.targetBinary`}
                                                labelOn="Yes"
                                                labelOff="No"
                                            />
                                        </td>
                                        {
                                            getIn(values, `candidates.${index}.targetBinary`) ?
                                            <React.Fragment>
                                                <td>
                                                    <Input
                                                        name={`candidates.${index}.orbitPeriod`}
                                                        type="number"
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        name={`candidates.${index}.asini`}
                                                        type="number"
                                                    />
                                                </td>
                                                <td>
                                                    <Input
                                                        name={`candidates.${index}.orbitTp`}
                                                        type="number"
                                                    />
                                                </td>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </React.Fragment>
                                        }
                                        <td>
                                            <Button
                                                onClick={() => remove(index)}
                                            >
                                                <HiOutlineX />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td>

                                    <Button
                                        onClick={() => push(initialValues.candidates[0])}
                                    >
                                        <HiOutlinePlus />
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    )}
                />
            </Table>
            <PageNav
                handlePageChange={handlePageChange}
                forward={{key:'followups', label:'Followups'}}
            />
        </React.Fragment>
    );
};

export default CandidateForm;
