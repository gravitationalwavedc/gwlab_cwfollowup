import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';

const Select = ({ title, name, options, ...rest }) => {
    const { values, touched, errors, handleChange } = useFormikContext()
    return <React.Fragment>
        {
            title && <Form.Label>{title}</Form.Label>
        }
        <Form.Control
            id={name}
            name={name}
            as="select"
            value={getIn(values, name)}
            onChange={handleChange}
            isValid={touched[name] && !errors[name]}
            isInvalid={!!errors[name]}
            {...rest}
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
