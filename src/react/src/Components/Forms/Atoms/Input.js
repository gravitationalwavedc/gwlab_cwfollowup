import React from 'react';
import { useFormikContext } from 'formik';
import { Form } from 'react-bootstrap';

const Input = ({title, name, type, ...rest}) => {
    const { getFieldProps, touched, errors } = useFormikContext()
    return <Form.Group controlId={ name }>
        {
            title && <Form.Label>{title}</Form.Label>
        }
        <Form.Control 
            name={ name }
            type={ type } 
            isValid={touched[name] && !errors[name]}
            isInvalid={!!errors[name]}
            {...getFieldProps(name)} {...rest}/>
        <Form.Control.Feedback type='invalid'>
            {errors[name]}
        </Form.Control.Feedback>
    </Form.Group>};


export default Input;
