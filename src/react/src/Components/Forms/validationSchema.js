import * as Yup from 'yup';

Yup.setLocale({
    mixed: {
        required: 'Required field'
    },
});

let validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'Make the title longer than 5 characters.')
        .max(30, 'Make the title less than 30 characters.')
        .matches(/^[0-9a-z\_\-]+$/i, 'Remove any spaces or special characters.')
        .required(),

    followupChoices: Yup.array(Yup.string()).min(1, 'Include at least 1 followup'),
});

export default validationSchema;
