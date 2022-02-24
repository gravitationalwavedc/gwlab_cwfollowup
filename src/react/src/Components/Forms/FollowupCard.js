import React from 'react';
import { Card } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import Switch from './Atoms/Switch';

const FollowupCard = ({name, label, value, description}) => {
    const { values } = useFormikContext();
    const checked = values[name].indexOf(value) !== -1;
    return (
        <Card text={checked ? 'black' : 'muted'}>
            <Card.Header className="h4">
                {label}
                <Switch
                    className="float-right"
                    id={name+label}
                    name={name}
                    value={value}
                    labelOn='On'
                    labelOff='Off'
                    checked={checked}
                />
            </Card.Header>
            <Card.Body>
                {description}
            </Card.Body>
        </Card>
    );
};


export default FollowupCard;
