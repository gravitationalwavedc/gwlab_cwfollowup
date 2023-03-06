import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const Error404 = ({message}) => <Container><Row><Col><h1>404</h1><h5>{message}</h5></Col></Row></Container>;

export default Error404;
