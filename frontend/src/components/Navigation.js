import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LinkContainer from './LinkContainer';

const Navigation = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Digital Form Builder</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/upload">
              <Nav.Link>Upload Form</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/forms">
              <Nav.Link>My Forms</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/reports">
              <Nav.Link>Reports</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 