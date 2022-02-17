import * as Yup from 'yup';

let validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(5, 'Make the title longer than 5 characters.')
        .max(30, 'Make the title less than 30 characters.')
        .matches(/^[0-9a-z\_\-]+$/i, 'Remove any spaces or special characters.')
        .required(),
    
    candidates: Yup.array().of(
        Yup.object().shape({
            candidateFrequency: Yup.number().required(),
            sourceDataset: Yup.string().required(),
            orbitTp: Yup.number().required(),
            asini: Yup.number().required(),
            orbitPeriod: Yup.number().required()
        })
    ).required('Must have candidates')
    .min(1, 'Minimum of 1 candidate'),

    followupChoices: Yup.array(Yup.string()).min(1, 'Include at least 1 followup'),
});

export default validationSchema;
