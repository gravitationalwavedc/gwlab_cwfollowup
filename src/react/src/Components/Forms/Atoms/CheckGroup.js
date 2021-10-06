import React from 'react';

import { Form } from 'react-bootstrap';
import { useFormikContext } from 'formik';

const CheckGroup = ({ title, name, options }) => {
    const { handleChange, touched, errors, values} = useFormikContext()
    return <React.Fragment>
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
                onChange={handleChange}
                isValid={touched[name] && !errors[name]}
                isInvalid={!!errors[name]}
                checked={values[name].indexOf(value) !== -1}
            />
        )}
    </React.Fragment>};

export default CheckGroup;
