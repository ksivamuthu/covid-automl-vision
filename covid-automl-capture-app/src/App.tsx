import React, { useState, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Nav, Navbar, Button, Card, Col, Toast } from 'react-bootstrap'
import Webcam from "react-webcam"
import axios from 'axios';
enum LabelType {
  danger = 0,
  safe = 1
}

function App() {
  const webCamHref = useRef<any>(null);
  const [show, setShow] = useState(false);

  const capture = (labelType: LabelType) => {
    if (webCamHref && webCamHref.current) {
      const src = webCamHref.current.getScreenshot();
      axios.post('/api/upload', { image: src, type: LabelType[labelType] }).then(() => {
        setShow(true);
      });
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
              <Webcam ref={webCamHref} audio={false} screenshotFormat={"image/png"} height={340} width={560}></Webcam>
            </Card.Body>
            <Card.Footer>
              <Row>
                <Col><Button variant="outline-danger" onClick={() => capture(LabelType.danger)}>🤦 Danger: Touching your face</Button>{' '}</Col>
                <Col><Button variant="outline-success" onClick={() => capture(LabelType.safe)}>😊Good: No hands on your face</Button>{' '}</Col>
              </Row>
            </Card.Footer>
          </Card>
        </Row>
      </Container>
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded mr-2"
            alt=""
          />
          <strong className="mr-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
      </Toast>
    </div >
  );
}

export default App;
