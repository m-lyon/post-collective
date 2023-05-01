import { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { SuccessModalContext } from '../context/ModalContext';

export function SuccessModal(props) {
    const { successProps } = useContext(SuccessModalContext);
    const { show, message, onHide } = successProps;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
        </Modal>
    );
}
