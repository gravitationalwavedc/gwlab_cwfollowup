import React from 'react';
import { useFormikContext, getIn } from 'formik';
import { Form } from 'react-bootstrap';

const Input = ({title, name, type, ...rest}) => {
    const { getFieldProps, touched, errors } = useFormikContext();
    const error = getIn(errors, name);
    const isTouched = getIn(touched, name);
    return <Form.Group controlId={ name }>
        {
            title && <Form.Label>{title}</Form.Label>
        }
        <Form.Control
            label={ name }
            name={ name }
            type={ type } 
            isValid={isTouched && !error}
            isInvalid={!!error}
            {...getFieldProps(name)} {...rest}/>
        <Form.Control.Feedback type='invalid'>
            {error}
        </Form.Control.Feedback>
    </Form.Group>;};


export default Input;
