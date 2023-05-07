import axios from 'axios';

import { useEffect, useState, useContext } from 'react';
import { Col, Container, Modal, Row, Form, Button } from 'react-bootstrap';
import { ErrorModalContext } from '../context/ActionModalContext';
import { SuccessModalContext } from '../context/ActionModalContext';

export function ForgotPasswordModal(props) {
    const { show, onHide, initEmail, hideModal } = props;
    const [email, setEmail] = useState(initEmail);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setErrorProps } = useContext(ErrorModalContext);
    const { setSuccessProps } = useContext(SuccessModalContext);

    useEffect(() => {
        setEmail(initEmail);
    }, [initEmail]);

    function formSubmitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        axios
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
                        hideModal();
                    },
                }));
            })
            .catch((err) => {
                setIsSubmitting(false);
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
                                <div className='d-grid gap-2' style={{ paddingTop: '0.5rem' }}>
                                    <Button variant='success' type='submit' disabled={isSubmitting}>
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
