import axios from 'axios';

import { useState, useContext } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { SignupModal } from './SignupModal';
import { UserContext } from '../context/UserContext';
import { ErrorModal } from './ErrorModal';
import { getConfig } from '../utils/auth';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export function LoginPage(props) {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const setUserContext = useContext(UserContext)[1];

    function formSubmitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const genericErrorMessage = 'Something went wrong! Please try again later.';
        axios
            .post(
                `${process.env.REACT_APP_API_ENDPOINT}/users/login`,
                { username: email, password: password },
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
                    setShowErrorModal(true);
                } else if (error.response.status === 401) {
                    setError('Invalid email and password combination.');
                    setShowErrorModal(true);
                } else {
                    setError(genericErrorMessage);
                    setShowErrorModal(true);
                }
            });
    }

    return (
        <Container className='login-container'>
            <Row className='login-box'>
                <Col className='login-form'>
                    <h1 style={{ marginBottom: '2rem' }}>
                        Balmoral House
                        <br />
                        Postal Collective
                    </h1>
                    <Form onSubmit={formSubmitHandler}>
                        <Form.Group style={{ marginBottom: '0.5rem' }}>
                            <Form.Control
                                id='email'
                                type='email'
                                placeholder='Email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group style={{ marginBottom: '0.5rem' }}>
                            <Form.Control
                                id='password'
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <div className='d-grid gap-2' style={{ paddingTop: '0.5rem' }}>
                            <Button variant='primary' type='submit' disabled={isSubmitting}>
                                {`${isSubmitting ? 'Logging in...' : 'Log in'}`}
                            </Button>
                        </div>
                        <div style={{ paddingTop: '1rem', textAlign: 'center' }}>
                            <span className='forgot-link' onClick={() => setShowForgotModal(true)}>
                                Forgotten password?
                            </span>
                        </div>
                        <div className='divider'></div>
                        <div className='register'>
                            <Button
                                variant='success'
                                type='button'
                                onClick={() => setShowRegisterModal(true)}
                            >
                                Create new account
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <ForgotPasswordModal
                show={showForgotModal}
                onHide={() => setShowForgotModal(false)}
                initEmail={email}
                hideModal={() => setShowForgotModal(false)}
            />
            <SignupModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} />
            <ErrorModal
                show={showErrorModal}
                onHide={() => setShowErrorModal(false)}
                error={error}
            />
        </Container>
    );
}
