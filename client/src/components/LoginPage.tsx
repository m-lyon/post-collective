import axios from 'axios';

import { useState, useContext } from 'react';
import { Container, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { SignupModal } from './SignupModal';
import { UserContext } from '../context/UserContext';
import { getConfig } from '../utils/auth';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { ErrorModalContext } from '../context/ActionModalContext';
import { useSubmit } from '../hooks/useSubmit';

export function LoginPage(props) {
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotModal, setShowForgotModal] = useState(false);
    const setUserContext = useContext(UserContext)[1];
    const { setErrorProps } = useContext(ErrorModalContext);
    const { isSubmitting, hasSubmitted, handleSubmit, resetSubmit } = useSubmit();

    function formSubmitHandler() {
        return axios
            .post(
                `${process.env.REACT_APP_API_ENDPOINT}/users/login`,
                { username: email, password: password },
                getConfig()
            )
            .then((response) => {
                setUserContext((oldValues) => {
                    return {
                        ...oldValues,
                        token: response.data.token,
                        details: response.data.user,
                    };
                });
            })
            .catch((error) => {
                let errorMsg = 'Something went wrong! Please try again later.';
                if (error.response) {
                    if (error.response.status === 400) {
                        errorMsg = 'Please fill in both email and password.';
                    } else if (error.response.status === 401) {
                        errorMsg = 'Invalid email and password combination.';
                    }
                }
                setErrorProps((oldValues) => ({
                    ...oldValues,
                    show: true,
                    message: errorMsg,
                    onHide: () => {
                        setErrorProps((oldValues) => ({ ...oldValues, show: false }));
                        resetSubmit();
                    },
                }));
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
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(formSubmitHandler);
                        }}
                    >
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
                            <Button
                                variant='primary'
                                type='submit'
                                disabled={isSubmitting || hasSubmitted}
                            >
                                {isSubmitting && <Spinner animation='border' size='sm' />}
                                {`${isSubmitting ? ' Logging in...' : 'Log in'}`}
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
        </Container>
    );
}
