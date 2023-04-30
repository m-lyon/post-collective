import axios from 'axios';
import { useEffect, useState } from 'react';
import { Col, Container, Modal, Row, Form, Button } from 'react-bootstrap';
import { ErrorModal } from './ErrorModal';
import { SuccessModal } from './SuccessModal';

export function ForgotPasswordModal(props) {
    const { show, onHide, initEmail, hideModal } = props;
    const [email, setEmail] = useState(initEmail);
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setEmail(initEmail);
    }, [initEmail]);

    function formSubmitHandler(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const genericErrorMessage = 'Something went wrong! Please try again later.';
        axios
            .post(`${process.env.REACT_APP_API_ENDPOINT}/resetPassword`, {
                username: email,
            })
            .then(() => {
                setShowSuccessModal(true);
            })
            .catch((err) => {
                if (err.response.status === 400 && err.response.data.message === 'user-not-found') {
                    setError('Email address not found.');
                } else {
                    setError(genericErrorMessage);
                }
                setShowErrorModal(true);
            });
    }

    return (
        <>
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
                                        <Button
                                            variant='success'
                                            type='submit'
                                            disabled={isSubmitting}
                                        >
                                            {`${
                                                isSubmitting
                                                    ? 'Sending...'
                                                    : 'Send reset password link'
                                            }`}
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
            <SuccessModal
                show={showSuccessModal}
                onHide={() => {
                    setShowSuccessModal(false);
                    setIsSubmitting(false);
                    hideModal();
                }}
                msg={`A reset password link has been sent to ${email}`}
            />
            <ErrorModal
                show={showErrorModal}
                onHide={() => {
                    setShowErrorModal(false);
                    setIsSubmitting(false);
                    hideModal();
                }}
                error={error}
            />
        </>
    );
}
