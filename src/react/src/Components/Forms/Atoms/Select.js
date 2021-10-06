import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';

const Select = ({ title, name, options }) => {
    const { values, touched, errors, handleChange } = useFormikContext()
    return <React.Fragment>
        <Form.Label>{title}</Form.Label>
        <Form.Control
            id={name}
            name={name}
            as="select"
            value={getIn(values, name)}
            onChange={handleChange}
            isValid={touched[name] && !errors[name]}
            isInvalid={!!errors[name]}
        >
            {options.map(({label, value}) =>
                <option
                    id={name + label}
                    key={name + label}
                    value={value}
                >
                    {label}
                </option>
            )}
        </Form.Control>
    </React.Fragment>};

export default Select;
