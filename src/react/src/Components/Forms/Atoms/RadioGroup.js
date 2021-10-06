import React from 'react';
import { Form } from 'react-bootstrap';

const RadioGroup = ({ title, formik, name, options, ...props }) => {
    const { handleChange, values, errors } = useFormikContext()
    return <React.Fragment>
        <Form.Label>{ title }</Form.Label>
        {options.map(({label, value}) => 
            <Form.Check 
                custom 
                id={ name + label }
                key={ name + label }
                label={ label } 
                type="radio" 
                name={ name } 
                value={ value } 
                onChange={ handleChange } 
                checked={ values[name] === value }
                {...props}
            />
        )}
        <Form.Control.Feedback type='invalid'>
            {errors[name]}
        </Form.Control.Feedback>
    </React.Fragment>};

export default RadioGroup;
