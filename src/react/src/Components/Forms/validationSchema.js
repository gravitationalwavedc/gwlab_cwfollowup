import * as Yup from 'yup';

let validationSchema = Yup.object().shape({
    candidateFrequency: Yup.number().required(),
    followupChoices: Yup.array(Yup.string()).min(1),
    targetBinary: Yup.boolean().required(),
    orbitTp: Yup.number().required(),
    asini: Yup.number().required(),
    orbitPeriod: Yup.number().required()
});

export default validationSchema;
