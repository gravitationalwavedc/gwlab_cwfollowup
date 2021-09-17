import React, { useState } from 'react';
import {commitMutation} from 'relay-runtime';
import {graphql, createFragmentContainer} from 'react-relay';
import {harnessApi} from '../index';
import { Container, Col, Row, Tab, Nav, Button } from 'react-bootstrap';

const TestPage = ({ router, data }) => {
    return (
        <Container>
            <div>hello</div>
        </Container>
    )
}

export default createFragmentContainer(TestPage,
    {
        data: graphql`
            fragment TestPage_data on Query @argumentDefinitions(
                    jobId: {type: "ID!"}
            ) {
                viterbiJob (id: $jobId) {
                    id
                    start {
                        name
                    }
                }
            }
        `,
    }

)
