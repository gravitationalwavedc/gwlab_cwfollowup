import React from 'react';
import {Button, Col, Row, Table,} from 'react-bootstrap';
import FormCard from '../Forms/FormCard';
import _ from 'lodash';
import followupOptions from '../../Utils/followupOptions';

const Parameters = ({ candidates, followups }) => (
    <Row>
        <Col>
            <FormCard title="Candidate Parameters">
                <Table>
                    <tbody>
                        <tr>
                            <th>Frequency (Hz)</th>
                            <th>Observing Run</th>
                            <th>Orbital Period (s)</th>
                            <th>Projected semi-major axis</th>
                            <th>Time of ascension (GPS s)</th>
                        </tr>
                        {
                            candidates.map((candidate, index) => (
                                <tr key={index}>
                                    <td>
                                        {_.round(candidate.candidateFrequency, 2).toFixed(2)}
                                    </td>
                                    <td>
                                        {candidate.sourceDataset, 2}
                                    </td>
                                    {
                                        candidate.targetBinary ?
                                            <React.Fragment>
                                                <td>
                                                    {_.round(candidate.orbitPeriod, 2).toFixed(2)}
                                                </td>
                                                <td>
                                                    {_.round(candidate.asini, 2).toFixed(2)}
                                                </td>
                                                <td>
                                                    {_.round(candidate.orbitTp, 2).toFixed(2)}
                                                </td>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </React.Fragment>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </FormCard>
            <FormCard title="Followups">
                <Table>
                    <tbody>
                        {
                            followups.map((followup, index) => {
                                const followupObj = followupOptions.find(obj => obj.value === followup);
                                return <tr key={index}>
                                    <th>{followupObj.label}</th>
                                    <td className="text-right">{followupObj.shortDescription}</td>
                                </tr>;
                            })
                        }
                    </tbody>
                </Table>
            </FormCard>
        </Col>
    </Row>
);

export default Parameters;
