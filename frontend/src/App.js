import React, { Component } from 'react';
import './App.css';
import Graph from './Graph/Graph.js';
import MobileView from './MobileView/MobileView.js';
import { Button, Navbar, Nav, Form, FormControl, ButtonToolbar, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";


class App extends Component {
  
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">Note Nodes</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <NavLink to="/" activeClassName="nav-selected">Home</NavLink>
              <NavLink to="/upload/" activeClassName="nav-selected">Projects</NavLink>

              <Nav className="mr-auto">
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <div className="content">
            <Route path="/" exact component={Graph} />
            <Route path="/upload" component={MobileView} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
