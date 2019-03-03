import React, { Component } from 'react';
import './App.css';
import Graph from './Graph/Graph.js';
import Grid from './Grid/Grid.js';
import MobileView from './MobileView/MobileView.js';
import { Button, Navbar, Nav, Form, FormControl, ButtonToolbar, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import edit from "./edit.png";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialState: "Search...",
      query: ""
    }
  }

  handleChange(event) {
    this.setState({
        query: event.target.value
      });
    console.log(event.target.value);
  }
  
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar bg="dark" variant="dark" expand="md">
            <img className="logo" src={edit} />
            <Navbar.Brand href="/">Note Nodes</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <NavLink to="/" activeClassName="nav-selected">Home</NavLink>
              <NavLink to="/upload/" activeClassName="nav-selected">Scan</NavLink>
              <NavLink to="/grid/" activeClassName="nav-selected">Grid</NavLink>

              <Nav className="mr-auto">
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder={this.state.initialState} onChange={this.handleChange.bind(this)} className="mr-sm-2" />
                <Button variant="outline-success" onClick={this.handleChange.bind(this)}>Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <div className="content">
            <Route path="/" exact render={(props) => <Graph query={this.state.query}/>}/>
            <Route path="/upload" render={(props) => <MobileView query={this.state.query}/>} />
            <Route path="/grid" render={(props) => <Grid query={this.state.query}/>} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
