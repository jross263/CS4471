import React from "react";
import { useLocation } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import logo from "../assets/piggy-bank.svg";

const SiteNavbar = ({ children }) => {
  const location = useLocation();

  const checkLocation = () => {
    return location.pathname != "/login" && location.pathname != "/register";
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          CS4471 Group 11 Project
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {checkLocation() && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Services" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/subscriptions">
                  My Subscriptions
                </NavDropdown.Item>
                <NavDropdown.Item href="/services">
                  All Services
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/admin">
                  Manage Services
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="/login">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>
      <div className="container">{children}</div>
    </>
  );
};

export { SiteNavbar };
