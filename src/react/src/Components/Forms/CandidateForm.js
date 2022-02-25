import React from 'react';
import {Button, Table} from 'react-bootstrap';
import Input from './Atoms/Input';
import Switch from './Atoms/Switch';
import Select from './Atoms/Select';
import { FieldArray, useFormikContext, getIn } from 'formik';
import initialValues from './initialValues';
import { HiOutlineX, HiOutlinePlus } from 'react-icons/hi';
import PageNav from './Atoms/PageNav';
import CSVUpload from './Atoms/CSVUpload';
import { cleanData, checkData } from '../../Utils/csvUtils';

const CandidateForm = ({ handlePageChange, viterbiId }) => {
    const { values, setFieldValue } = useFormikContext();
    const defaultData = initialValues.candidates[0];
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
                                        <td className="align-top">
                                            <Input
                                                name={`candidates.${index}.candidateFrequency`}
                                                type="number"
                                                className='px-3'
                                            />
                                        </td>
                                        <td className="align-top">
                                            <Select
                                                name={`candidates.${index}.sourceDataset`} 
                                                options={[
                                                    {label:'O1', value: 'o1'},
                                                    {label:'O2', value: 'o2'},
                                                    {label:'O3', value: 'o3'},
                                                    {label:'O4', value: 'o4'},
                                                ]}
                                                className='px-3'
                                            />
                                        </td>
                                        <td className="align-top">
                                            <Switch
                                                name={`candidates.${index}.targetBinary`}
                                                labelOn="Yes"
                                                labelOff="No"
                                                value={true}
                                            />
                                        </td>
                                        {
                                            getIn(values, `candidates.${index}.targetBinary`) ?
                                                <React.Fragment>
                                                    <td className="align-top">
                                                        <Input
                                                            name={`candidates.${index}.orbitPeriod`}
                                                            type="number"
                                                            className='px-3'
                                                        />
                                                    </td>
                                                    <td className="align-top">
                                                        <Input
                                                            name={`candidates.${index}.asini`}
                                                            type="number"
                                                            className='px-3'
                                                        />
                                                    </td>
                                                    <td className="align-top">
                                                        <Input
                                                            name={`candidates.${index}.orbitTp`}
                                                            type="number"
                                                            className='px-3'
                                                        />
                                                    </td>
                                                </React.Fragment>
                                                :
                                                <td colSpan={3}/>
                                        }
                                        <td className="align-top">
                                            <Button
                                                onClick={() => remove(index)}
                                                data-testid={`remove-candidate-button-${index}`}
                                            >
                                                <HiOutlineX />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                            {
                                !viterbiId && <tr>
                                    <td>
                                        <CSVUpload
                                            cleanData={cleanData}
                                            checkData={checkData}
                                            saveData={data => {
                                                setFieldValue('candidates', []);
                                                data.forEach(
                                                    candidate => {
                                                        push({
                                                            candidateFrequency: candidate[0],
                                                            sourceDataset: candidate[1],
                                                            targetBinary: candidate[2],
                                                            orbitPeriod: candidate[3] || defaultData.orbitPeriod,
                                                            asini: candidate[4] || defaultData.asini,
                                                            orbitTp: candidate[5] || defaultData.orbitTp,
                                                        });
                                                    }
                                                );
                                            }}
                                            text='Upload candidates from CSV'
                                        />
                                    </td>
                                    <td colSpan={5}/>
                                    <td>
                                        <Button
                                            onClick={() => push(defaultData)}
                                            data-testid='add-candidate-button'
                                        >
                                            <HiOutlinePlus />
                                        </Button>
                                    </td>
                                </tr>
                            }
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
