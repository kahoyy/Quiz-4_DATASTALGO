import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Container, Row, Col } from "react-bootstrap";

function Header() {
  const navigate = useNavigate();

  // Mock current user (in real app, this would come from auth context)
  const currentUser = {
    role: 'admin' // Can be 'admin', 'manager', or 'user'
  };

  return (
    <header>
      <Navbar expand="lg" bg="primary" variant="dark" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Project Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link onClick={() => navigate('/')}>Dashboard</Nav.Link>
              {currentUser.role === 'admin' && (
                <Nav.Link onClick={() => navigate('/users')}>Users</Nav.Link>
              )}
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
