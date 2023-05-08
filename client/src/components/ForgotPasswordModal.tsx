import axios from 'axios';

import { useEffect, useState, useContext } from 'react';
import { Col, Container, Modal, Row, Form, Button } from 'react-bootstrap';
import { ErrorModalContext } from '../context/ActionModalContext';
import { SuccessModalContext } from '../context/ActionModalContext';
import { useSubmit } from '../hooks/useSubmit';

export function ForgotPasswordModal(props) {
    const { show, onHide, initEmail, hideModal } = props;
    const [email, setEmail] = useState(initEmail);
    const { setErrorProps } = useContext(ErrorModalContext);
    const { setSuccessProps } = useContext(SuccessModalContext);
    const { isSubmitting, hasSubmitted, handleSubmit, resetSubmit } = useSubmit();

    useEffect(() => {
        setEmail(initEmail);
    }, [initEmail]);

    function formSubmitHandler() {
        return axios
            .post(`${process.env.REACT_APP_API_ENDPOINT}/resetPassword`, {
                username: email,
            })
            .then(() => {
                setSuccessProps((oldValues) => ({
                    ...oldValues,
                    show: true,
                    message: `A reset password link has been sent to ${email}`,
                    onHide: () => {
                        setSuccessProps((oldValues) => ({ ...oldValues, show: false }));
                        setEmail('');
                        resetSubmit();
                        hideModal();
                    },
                }));
            })
            .catch((err) => {
                let errorMsg = 'Something went wrong! Please try again later.';
                if (err.response.status === 400 && err.response.data.message === 'user-not-found') {
                    errorMsg = 'Email address not found.';
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
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reset password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col>
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
                                <div className='d-grid gap-2' style={{ paddingTop: '0.5rem' }}>
                                    <Button
                                        variant='success'
                                        type='submit'
                                        disabled={isSubmitting || hasSubmitted}
                                    >
                                        {`${
                                            isSubmitting ? 'Sending...' : 'Send reset password link'
                                        }`}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}
