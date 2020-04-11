import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Nav, Navbar, Button, Card, Col } from 'react-bootstrap'
import Webcam from "react-webcam"

function App() {
  const webCamHref = useRef<any>(null);

  const capture = () => {
    if (webCamHref && webCamHref.current) {
      const src = webCamHref.current.getScreenshot();
      console.log(src);
    }
  }

  return (
    <div className="App">
      <Navbar bg="primary" expand="lg" variant="dark" >
        <Navbar.Brand href="#home">COVID AutoML Vision</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Row className="justify-content-md-center">
          <Card>
            <Card.Title>
              <div>
                <h4>COVID Cam - Avoid touching your face. </h4>
                <h5>Take picture here to train the model</h5>
              </div>
            </Card.Title>
            <Card.Body>
              <Webcam ref={webCamHref} audio={false} height={340} width={560}></Webcam>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col><Button variant="outline-danger" onClick={capture}>🤦 Danger: Touching your face</Button>{' '}</Col>
                <Col><Button variant="outline-success" onClick={capture}>😊Good: No hands on your face</Button>{' '}</Col>
              </Row>
            </Card.Footer>
          </Card>
        </Row>
      </Container>
    </div >
  );
}

export default App;
