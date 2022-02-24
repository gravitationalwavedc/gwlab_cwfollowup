import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';

const PageNav = ({handlePageChange, forward, backward, handleSubmit }) => {
    const isSubmitForm = handleSubmit !== undefined;

    const handleForward = () => {
        if (isSubmitForm) {
            handleSubmit();
        } else {
            handlePageChange(forward.key);
        }
    };

    return (
        <>
            <Row className="d-none d-md-flex justify-content-between mt-4">
                <Col md={5} lg={4} xl={3}>
                    { backward && <Button variant="tertiary" onClick={() => handlePageChange(backward.key)}>
                        <HiChevronLeft/>{backward.label}
                    </Button>}
                </Col>
                <Col md={5} lg={4} xl={3}>
                    <Button onClick={handleForward}>
                        {forward.label}{!isSubmitForm && <HiChevronRight/>}
                    </Button>
                </Col>
            </Row>
        </>);
};
export default PageNav;
