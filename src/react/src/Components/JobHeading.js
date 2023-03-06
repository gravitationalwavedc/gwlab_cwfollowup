import React, { useState } from 'react';
import { Row, Col, Container, Toast } from 'react-bootstrap';
import PrivacyToggle from '../Components/Results/PrivacyToggle';
import moment from 'moment';

const JobHeading = ({ jobData }) => {
    const [saved, setSaved] = useState(false); 
    const [showNotification, setShowNotification] = useState(false);

    const onSave = (saved, message) => {
        setSaved(saved);
        setShowNotification(true);
    };

    const { id, start, lastUpdated, userId, jobStatus } = jobData;

    const updated = moment.utc(lastUpdated, 'YYYY-MM-DD HH:mm:ss UTC').local().format('llll');

    return <Container className="pt-5">
        {showNotification && 
              <Toast 
                  style={{position: 'absolute', top: '56px', right:'50px'}} 
                  onClose={() => setShowNotification(false)} 
                  show={showNotification} 
                  delay={3000} 
                  autohide>
                  <Toast.Header>Saved</Toast.Header>
                  <Toast.Body>Updated job labels.</Toast.Body>
              </Toast>
        }
        <Row className="mb-3">
            <Col md={3} xl={2} />
            <Col md={9} xl={10} xs={12}>
                <h1>{start.name}</h1>
                <p>{start.description}</p>
                <p>Updated on {updated}</p>
                <p>{jobStatus.name}</p>
                <PrivacyToggle 
                    userId={userId} 
                    jobId={id} 
                    data={start} 
                    onUpdate={onSave} />
            </Col>
        </Row>
    </Container>;
};

export default JobHeading;
