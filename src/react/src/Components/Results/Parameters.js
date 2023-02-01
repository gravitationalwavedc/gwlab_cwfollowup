import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import FormCard from '../Forms/FormCard';
import followupOptions from '../../Utils/followupOptions';

const Parameters = ({ candidates, followups }) => (
    <Row>
        <Col>
            <FormCard title="Candidate Parameters">
                Placeholder
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
