import { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { ErrorModalContext } from '../context/ModalContext';

export function ErrorModal(props) {
    const { errorProps } = useContext(ErrorModalContext);
    const { show, message, onHide } = errorProps;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
        </Modal>
    );
}
