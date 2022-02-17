import React from 'react';
import { Form, Card } from 'react-bootstrap';
import { useFormikContext } from 'formik';

const FollowupCard = ({name, label, value, description}) => {
    const { values, touched, errors, handleChange } = useFormikContext()
    const checked = values[name].indexOf(value) !== -1;

    return (
        <Card text={checked ? 'black' : 'muted'}>
            <Card.Header className="h4">
                {label}
                <Form.Group className="float-right" controlId={ name }>
                    <Form.Check
                        custom
                        id={name + label}
                        label={checked ? 'On' : 'Off'}
                        type="switch"
                        name={name}
                        value={value}
                        onChange={handleChange}
                        isValid={touched[name] && !errors[name]}
                        isInvalid={!!errors[name]}
                        checked={checked}
                    />
                    <Form.Control.Feedback type='invalid'>
                        {errors[name]}
                    </Form.Control.Feedback>
                </Form.Group>
            </Card.Header>
            <Card.Body>
                {description}
            </Card.Body>
        </Card>
    );
};


export default FollowupCard;
