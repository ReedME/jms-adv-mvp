import React from "react";
import { Container, Nav, NavDropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
  return (
    <>
      <Navbar bg="light">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand> React Viability Demo </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/JobView">
                <Nav.Link>Job List</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <LinkContainer to="/Assets">
                  <NavDropdown.Item>Assets</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/Clients">
                  <NavDropdown.Item>Clients</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/Users">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/Profile">
                  <NavDropdown.Item>My Profile</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <SignOutButton />
        </Container>
      </Navbar>
      <h5>
        <center>Welcome</center>
      </h5>
      <br />
      <br />
      {props.children}
    </>
  );
};
