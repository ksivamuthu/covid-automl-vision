import React, { useState, useRef, Fragment } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Button, Card, Col, Toast, Alert } from 'react-bootstrap'
import Webcam from "react-webcam"
import axios from 'axios';

enum LabelType {
    danger = 0,
    safe = 1
}

export function Train() {
    const webCamHref = useRef<any>(null);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState({ text: '', success: true });

    const capture = (labelType: LabelType) => {
        setShow(false);
        if (webCamHref && webCamHref.current) {
            const src = webCamHref.current.getScreenshot();
            axios.post('/api/upload', { image: src, type: LabelType[labelType] }).then(() => {
                setMsg({ text: 'Success', success: true });
                setShow(true);
            }).catch(() => {
                setMsg({ text: 'Error', success: false });
                setShow(true);
            });
        }
    }

    return (
        <Fragment>
            <Container>
                <Row className="justify-content-md-center">
                    <Card>
                        <Card.Title>
                            <div className="align-items-center">
                                <p className="center">COVID Cam - Avoid touching your face. </p>
                                <p className="center">Take picture here to train the model</p>
                            </div>
                        </Card.Title>
                        <Card.Body>
                            <Webcam ref={webCamHref} audio={false} screenshotFormat={"image/png"} height={"100%"} width={"100%"}></Webcam>
                        </Card.Body>
                        <Card.Footer>
                            <Container>
                                <Row noGutters={false} xs={1} md={2}>
                                    <Col><Button variant="outline-danger" onClick={() => capture(LabelType.danger)}><span aria-label="facepalm" role="img">🤦</span> Danger: Touching your face</Button>{' '}</Col>
                                    <Col><Button variant="outline-success" onClick={() => capture(LabelType.safe)}><span aria-label="smile" role="img">😊</span>Good: No hands on your face</Button>{' '}</Col>
                                </Row>
                            </Container>
                        </Card.Footer>
                    </Card>
                </Row>
            </Container>
            {show && <Alert variant={msg.success ? 'success' : 'danger'}>
                <h1 className="center">{msg.text}</h1>
            </Alert>}
        </Fragment>
    )
}