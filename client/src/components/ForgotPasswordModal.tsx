import axios from 'axios';
import { useState } from 'react';
import { Col, Container, Modal, Row, Form, Button } from 'react-bootstrap';

export function ForgotPasswordModal(props) {
    const { show, onHide, initEmail } = props;
    const [email, setEmail] = useState(initEmail);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function formSubmitHandler(e) {
        console.log('clicked');
        // TODO
        // const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/resetPassword`, )
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
                                    <Button variant='primary' type='submit' disabled={isSubmitting}>
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
