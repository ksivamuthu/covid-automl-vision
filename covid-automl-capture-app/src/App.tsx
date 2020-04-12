import React, { } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar } from 'react-bootstrap'
import { Train } from './Train'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Detect } from './Detect';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="primary" expand="lg" variant="dark" >
          <Navbar.Brand href="/detect">COVID AutoML Vision</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/detect">Detect</Nav.Link>
              <Nav.Link href="/train">Train</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div >
      <Switch>
        <Route path="/detect">
          <Detect></Detect>
        </Route>
        <Route path="/train">
          <Train></Train>
        </Route>
        <Redirect exact from="/" to="detect" />
      </Switch>
    </Router>
  );
}

export default App;
