// import React, { useState } from 'react';
// import {harnessApi} from '../../index';
// import { commitMutation, createFragmentContainer, graphql } from 'react-relay';
// import { Form } from 'react-bootstrap';

// const PrivacyToggle = (props) => {
//     const [isPrivate, setIsPrivate] = useState(props.data.private);
    
//     const handleChange = () => {
//         const newValue = !isPrivate;
//         setIsPrivate(newValue);
//         updateJob(
//             {
//                 jobId: props.jobId,
//                 private: newValue,
//             },
//             () => {}
//         );
//     };
    
//     return <Form.Group className="mt-3" controlId="privateToggle">
//         <Form.Check
//             type="checkbox"
//             label="Share with LIGO collaborators"
//             onChange={handleChange} 
//             disabled={harnessApi.currentUser.userId !== props.userId} 
//             checked={!isPrivate}/>
//     </Form.Group>;
// };

// const updateJob = (variables, callback) => commitMutation(harnessApi.getEnvironment('cwfollowup'), {
//     mutation: graphql`
//       mutation PrivacyToggleMutation($jobId: ID!, $private: Boolean, $labels: [String]) {
//         updateCwfollowupJob(input: {jobId: $jobId, private: $private, labels: $labels}) {
//           result
//         }
//       }
//     `,
//     optimisticResponse: {
//         updateCwfollowupJob: {
//             result: 'Job saved!'
//         }
//     },
//     variables: variables,
//     onCompleted: (response, errors) => {
//         if (errors) {
//             callback(false, errors);
//         }
//         else {
//             callback(true, response.updateCwfollowupJob.result);
//         }
//     },
// });

// export default createFragmentContainer(PrivacyToggle, {
//     data: graphql`
//         fragment PrivacyToggle_data on OutputStartType{
//             private
//         }
//     `
// });




