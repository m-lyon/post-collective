import axios from 'axios';

import { useContext, useReducer } from 'react';
import { Container, Form, Modal, Row, Col, Button, Spinner } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { ErrorModalContext } from '../context/ActionModalContext';
import { SuccessModalContext } from '../context/ActionModalContext';
import { getConfig } from '../utils/auth';
import { UPDATE_FORM, onInputChange, onFocusOut, runFormStateValidation } from '../utils/forms';
import { useSubmit } from '../hooks/useSubmit';
import { DisplayContext } from '../context/DisplayContext';

const initialState = {
    name: { value: '', touched: false, hasError: true, error: '' },
    email: { value: '', touched: false, hasError: true, error: '' },
    aptNum: { value: '', touched: false, hasError: true, error: '' },
    password: { value: '', touched: false, hasError: true, error: '' },
    isFormValid: false,
};

const formsReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM:
            const { name, value, hasError, error, touched, isFormValid } = action.data;
            return {
                ...state,
                [name]: { ...state[name], value, hasError, error, touched },
                isFormValid,
            };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
};

export function SignupModal(props) {
    const { show, onHide } = props;
    const setUserContext = useContext(UserContext)[1];
    const isMobile = useContext(DisplayContext);
    const { setErrorProps } = useContext(ErrorModalContext);
    const { setSuccessProps } = useContext(SuccessModalContext);
    const { isSubmitting, handleSubmit, resetSubmit } = useSubmit();

    const [formState, dispatch] = useReducer(formsReducer, initialState);

    function formSubmitHandler() {
        // Client-side validation
        runFormStateValidation(formState, dispatch);
        if (!formState.isFormValid) {
            return;
        }

        // Server side submission & error handling
        return axios
            .post(
                `${process.env.REACT_APP_API_ENDPOINT}/users/signup`,
                {
                    username: formState.email.value,
                    password: formState.password.value,
                    aptNum: formState.aptNum.value,
                    name: formState.name.value,
                },
                getConfig()
            )
            .then((response) => {
                setSuccessProps((oldValues) => ({
                    ...oldValues,
                    show: true,
                    message:
                        'Succesfully registered! A verification code will be sent to your postbox within the next few days.',
                    onHide: () => {
                        setSuccessProps((oldValues) => ({ ...oldValues, show: false }));
                        resetSubmit();
                    },
                }));
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
                        errorMsg = 'Please fill all the fields correctly!';
                    } else if (error.response.status === 409) {
                        if (error.response.data.message === 'apt-num-already-in-use') {
                            errorMsg = 'Apartment already in use.';
                        } else if (error.response.data.message === 'user-already-exists') {
                            errorMsg = 'Email already in use.';
                        } else if (error.response.data.message === 'invalid-apt-num') {
                            errorMsg = 'Invalid Apartment Number given.';
                        }
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
        <Modal
            show={show}
            onHide={() => {
                onHide();
                dispatch({ type: 'RESET_FORM' });
            }}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(formSubmitHandler);
                    }}
                >
                    <Container className='register-form'>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id='name'
                                        type='text'
                                        required
                                        placeholder='Name'
                                        value={formState.name.value}
                                        onChange={(e) => {
                                            onInputChange(
                                                'name',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        onBlur={(e) => {
                                            onFocusOut('name', e.target.value, dispatch, formState);
                                        }}
                                        isValid={formState.name.touched && !formState.name.hasError}
                                        isInvalid={
                                            formState.name.touched && formState.name.hasError
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formState.name.error}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Control
                                        id='aptNum'
                                        type='text'
                                        placeholder={isMobile ? 'Apt Number' : 'Apartment Number'}
                                        value={formState.aptNum.value}
                                        onChange={(e) => {
                                            onInputChange(
                                                'aptNum',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        onBlur={(e) => {
                                            onFocusOut(
                                                'aptNum',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        isValid={
                                            formState.aptNum.touched && !formState.aptNum.hasError
                                        }
                                        isInvalid={
                                            formState.aptNum.touched && formState.aptNum.hasError
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formState.aptNum.error}
                                    </Form.Control.Feedback>
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
                                        value={formState.email.value}
                                        onChange={(e) => {
                                            onInputChange(
                                                'email',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        onBlur={(e) => {
                                            onFocusOut(
                                                'email',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        isValid={
                                            formState.email.touched && !formState.email.hasError
                                        }
                                        isInvalid={
                                            formState.email.touched && formState.email.hasError
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formState.email.error}
                                    </Form.Control.Feedback>
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
                                        value={formState.password.value}
                                        onChange={(e) => {
                                            onInputChange(
                                                'password',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        onBlur={(e) => {
                                            onFocusOut(
                                                'password',
                                                e.target.value,
                                                dispatch,
                                                formState
                                            );
                                        }}
                                        isValid={
                                            formState.password.touched &&
                                            !formState.password.hasError
                                        }
                                        isInvalid={
                                            formState.password.touched &&
                                            formState.password.hasError
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formState.password.error}
                                    </Form.Control.Feedback>
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
                                        {isSubmitting && (
                                            <Spinner
                                                animation='border'
                                                size='sm'
                                                style={{ width: '1.4rem', height: '1.4rem' }}
                                            />
                                        )}
                                        {`${isSubmitting ? ' Signing up...' : 'Sign up'}`}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
