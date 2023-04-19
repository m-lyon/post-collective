import axios from 'axios';
import { BHNavbar } from './BHNavbar';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getConfig } from '../utils/auth';
import { ErrorModal } from './ErrorModal';

export function VerifyPage(props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userContext, setUserContext] = useContext(UserContext);
    const [showErrorModal, setShowErrorModal] = useState(false);

    function formSubmitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const genericErrorMessage = 'Something went wrong! Please try again later.';
        axios
            .post(
                `${process.env.REACT_APP_API_ENDPOINT}/users/verify`,
                { code },
                getConfig(userContext.token)
            )
            .then((response) => {
                setIsSubmitting(false);
                if (response.status === 200) {
                    const data = response.data;
                    setUserContext((oldValues) => {
                        return { ...oldValues, details: data.user };
                    });
                } else {
                    setError(genericErrorMessage);
                    setShowErrorModal(true);
                }
            })
            .catch((error) => {
                setIsSubmitting(false);
                if (error.response.status === 400) {
                    if (error.response.data.message === 'no-code-provided') {
                        setError('No verification code provided!');
                    } else if (error.response.data.message === 'user-already-verified') {
                        setError('Already verified!');
                    } else {
                        setError(genericErrorMessage);
                    }
                } else if (error.response.status === 401) {
                    setError('Incorrect code.');
                } else {
                    setError(genericErrorMessage);
                }
                setShowErrorModal(true);
            });
    }

    return (
        <>
            <BHNavbar />
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
                                    id='code'
                                    type='text'
                                    placeholder='Verification code'
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </Form.Group>
                            <div className='d-grid gap-2' style={{ paddingTop: '0.5rem' }}>
                                <Button variant='success' type='submit' disabled={isSubmitting}>
                                    {`${isSubmitting ? 'Verifying...' : 'Verify account'}`}
                                </Button>
                                <ErrorModal
                                    show={showErrorModal}
                                    onHide={() => setShowErrorModal(false)}
                                    error={error}
                                />
                            </div>
                        </Form>
                        {/* <div className='divider'></div>
                        <div className='register'>
                            <Button
                                variant='danger'
                                type='button'
                                onClick={() => console.log('logout clicked.')}
                            >
                                Logout
                            </Button>
                        </div> */}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
