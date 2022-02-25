import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';

const Switch = ({ id, title, name, value, labelOn, labelOff, checked, className, ...props }) => {
    const { handleChange, values, errors, touched} = useFormikContext();
    const isChecked = typeof checked == 'boolean' ? checked : getIn(values, name);
    return <Form.Group controlId={name} className={className}>
        {
            title && <Form.Label>{title}</Form.Label>
        }
        <Form.Check 
            custom 
            id={id}
            key={name}
            type="switch" 
            name={name}
            label={isChecked ? labelOn : labelOff}
            value={value}
            onChange={handleChange}
            isValid={getIn(touched, name) && !getIn(errors, name)}
            isInvalid={!!getIn(errors, name)}
            checked={isChecked}
            {...props}
        />
        <Form.Control.Feedback type='invalid'>
            {getIn(errors, name)}
        </Form.Control.Feedback>
    </Form.Group>;};

export default Switch;
