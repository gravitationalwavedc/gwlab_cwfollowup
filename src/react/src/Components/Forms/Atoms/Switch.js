import React from 'react';
import { Form } from 'react-bootstrap';

const Switch = ({ title, formik, name, value, labelOn, labelOff, ...props }) =>
    <React.Fragment>
        <Form.Label>{ title }</Form.Label>
            <Form.Check 
                custom 
                id={ name }
                key={ name }
                type="switch" 
                name={ name }
                label={formik.values[name] ? labelOn : labelOff}
                value={true}
                onChange={ formik.handleChange } 
                checked={ formik.values[name] }
                {...props}
            />
        <Form.Control.Feedback type='invalid'>
            {formik.errors[name]}
        </Form.Control.Feedback>
    </React.Fragment>;

export default Switch;
