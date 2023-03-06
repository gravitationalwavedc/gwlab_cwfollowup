import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import FormCard from '../Forms/FormCard';
import followupOptions from '../../Utils/followupOptions';

const Parameters = ({ candidateGroup, followups }) => (
    <Row>
        <Col>
            <FormCard title="Candidate Group" className="bg-transparent">
                <Table>
                    <tbody>
                        <tr>
                            <th>{candidateGroup.name}</th>
                            <td className="text-right">{`${candidateGroup.nCandidates} candidates`}</td>
                        </tr>
                        <tr>
                            <td>{candidateGroup.description}</td>
                            <td />
                        </tr>
                    </tbody>
                </Table>
            </FormCard>
            <FormCard title="Followups" className="bg-transparent">
                <Table>
                    <tbody>
                        {
                            followups.map(followup => {
                                const followupObj = followupOptions.find(obj => obj.value === followup);
                                return <tr key={followupObj.label}>
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
