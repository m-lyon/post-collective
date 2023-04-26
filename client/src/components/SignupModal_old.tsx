import axios from 'axios';

import { useState, useContext } from 'react';
import { Container, Form, Modal, Row, Col, Button } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { ErrorModal } from './ErrorModal';
import { getConfig } from '../utils/auth';

export function SignupModal(props) {
    const { show, onHide } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [aptNum, setAptNum] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setUserContext = useContext(UserContext)[1];
    const [showErrorModal, setShowErrorModal] = useState(false);

    function formSubmitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const genericErrorMessage = 'Something went wrong! Please try again later.';
        axios
            .post(
                `${process.env.REACT_APP_API_ENDPOINT}/users/signup`,
                { username: email, password, aptNum, name },
                getConfig()
            )
            .then((response) => {
                setIsSubmitting(false);
                if (response.status === 200) {
                    const data = response.data;
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: data.token, details: data.user };
                    });
                } else {
                    setError(genericErrorMessage);
                    setShowErrorModal(true);
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                if (error.response.status === 400) {
                    setError('Please fill all the fields correctly!');
                } else if (error.response.status === 401) {
                    setError(genericErrorMessage);
                } else if (error.response.status === 409) {
                    if (error.response.data.message === 'apt-num-already-in-use') {
                        setError('Apartment already in use.');
                    } else if (error.response.data.message === 'user-already-exists') {
                        setError('Email already in use.');
                    } else {
                        setError(genericErrorMessage);
                    }
                } else {
                    setError(genericErrorMessage);
                }
                setShowErrorModal(true);
            });
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formSubmitHandler}>
                    <Container className='register-form'>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id='name'
                                        type='text'
                                        placeholder='Name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id='aptNum'
                                        type='text'
                                        placeholder='Apartment number'
                                        value={aptNum}
                                        onChange={(e) => setAptNum(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id='email'
                                        type='email'
                                        placeholder='Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id='password'
                                        type='password'
                                        placeholder='New password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />{' '}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{ marginTop: '0.8em', fontSize: '0.8em' }}>
                                    Once you sign up, a verification code will be sent to your
                                    postbox to confirm your details.
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='divider2'></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className='register'>
                                    <Button
                                        style={{ fontSize: '1.5em' }}
                                        variant='success'
                                        type='submit'
                                        disabled={isSubmitting}
                                    >
                                        {`${isSubmitting ? 'Signing up...' : 'Sign up'}`}
                                    </Button>
                                    <ErrorModal
                                        show={showErrorModal}
                                        onHide={() => setShowErrorModal(false)}
                                        error={error}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
