import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';

const Switch = ({ title, formik, name, value, labelOn, labelOff, ...props }) => {
    const { handleChange, values, errors} = useFormikContext()
    return <Form.Group controlId={ name }>
        {
            title && <Form.Label>{title}</Form.Label>
        }
        <Form.Check 
            custom 
            key={ name }
            type="switch" 
            name={ name }
            label={getIn(values, name) ? labelOn : labelOff}
            value={true}
            onChange={ handleChange } 
            checked={ getIn(values, name) }
            {...props}
        />
        <Form.Control.Feedback type='invalid'>
            {errors[name]}
        </Form.Control.Feedback>
    </Form.Group>};

export default Switch;
