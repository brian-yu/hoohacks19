import React, { Component } from 'react';
import './App.css';
import MobileView from './MobileView/MobileView.js';
import { Button, Navbar, NavDropdown, Nav, Form, FormControl, ButtonToolbar, Alert } from 'react-bootstrap';

class App extends Component {
  
  render() {
    return (
      <div className="App">

      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Note Nodes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>

       {/* <MobileView/>*/}
      </div>
    
    );
  }
}

export default App;
