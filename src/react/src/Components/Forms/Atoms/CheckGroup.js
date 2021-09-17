import React from 'react';
import { Form } from 'react-bootstrap';

const CheckGroup = ({ title, formik, name, options }) =>
    <React.Fragment>
        <Form.Label>{title}</Form.Label>
        {options.map(({label, value}) =>
            <Form.Check
                custom
                id={name + label}
                key={name + label}
                label={label}
                type="checkbox"
                name={name}
                value={value}
                onChange={formik.handleChange}
                isValid={formik.touched[name] && !formik.errors[name]}
                isInvalid={!!formik.errors[name]}
                checked={formik.values[name].indexOf(value) !== -1}
            />
        )}
    </React.Fragment>;

export default CheckGroup;
