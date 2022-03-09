import React from 'react';
import {Link} from 'found';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';


const Menu = () => (
    <Navbar collapseOnSelect expand="md" fixed="top" className="navbar-secondary">
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Link className="nav-link" to='/cwfollowup' exact>
                        Followups
                    </Link>
                    <Link className="nav-link" to='/cwfollowup/new-job' exact>
                        New Followup
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
);

export default Menu;
