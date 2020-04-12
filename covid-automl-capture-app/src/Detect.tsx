import React, { useRef, Fragment, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Button, Card, Col, Alert } from 'react-bootstrap'
import Webcam from "react-webcam"
import { loadImageClassification, ImageClassificationModel } from '@tensorflow/tfjs-automl';

export function Detect() {
    const webCamHref = useRef<any>(null);
    const [imgData, setImgData] = useState('');
    const [model, setModel] = useState<ImageClassificationModel>();
    const [isRecording, setIsRecording] = useState(false);
    const [result, setResult] = useState('');

    useEffect(() => {
        if (model) {
            const image = document.getElementById('result') as any;
            image.src = imgData;
            model.classify(image, { centerCrop: false }).then((result) => {
                console.log(result);
                const danger = result.find(x => x.label === 'danger')?.prob;
                const safe = result.find(x => x.label === 'safe')?.prob;
                if (safe && danger) {
                    setResult(safe > danger ? 'safe' : 'danger');
                } else {
                    setResult('');
                }
            });
        }
    }, [imgData]);

    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(capture, 500);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        loadImageClassification('/tfjs/2/model.json').then((model) => {
            setModel(model);
        });
    }, []);

    const capture = () => {
        if (webCamHref && webCamHref.current) {
            const data = webCamHref.current.getScreenshot();
            setImgData(data);
        }
    }

    const toggleRecording = () => {
        setResult('');
        setIsRecording(!isRecording);
        setResult('');
    }

    return (
        <Fragment>
            <Container>
                <Row className="justify-content-md-center">
                    <Card>
                        <Card.Title>
                            <div className="align-items-center">
                                <h4 className="center">COVID Cam - Avoid touching your face. </h4>
                                <h5 className="center">Take picture or start recording to detect</h5>
                                {result && result.length > 0 && <Alert variant={result === 'safe' ? 'success' : 'danger'}>
                                    <h1 className="center">{result}</h1>
                                </Alert>}
                            </div>
                        </Card.Title>
                        <Card.Body>
                            <Webcam ref={webCamHref} audio={false} screenshotFormat={"image/png"} height={"100%"} width={"100%"}></Webcam>
                        </Card.Body>
                        <Card.Footer>
                            <Container>
                                <Row noGutters={false} xs={1} md={2}>
                                    <Col><Button variant="outline-primary" onClick={() => capture()}><span aria-label="facepalm" role="img">📸</span>Take picture</Button>{' '}</Col>
                                    <Col><Button variant="outline-primary" onClick={() => toggleRecording()}><span aria-label="smile" role="img">📹</span>{!isRecording ? 'Start Recording' : 'Stop Recording'}</Button>{' '}</Col>
                                </Row>
                            </Container>
                        </Card.Footer>
                    </Card>
                </Row>
                {imgData && <img style={{ display: "none" }} id="result" src={imgData} width={560} height={340}></img>}
            </Container>
        </Fragment>
    )
}