import { Modal } from 'react-bootstrap';

export function ErrorModal(props) {
    const { show, onHide, error } = props;

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>{error}</Modal.Body>
        </Modal>
    );
}
