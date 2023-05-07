import { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CancelOfferModalContext } from '../context/ReservationModalContext';

export function ConfirmCancelModal(props) {
    const { cancelProps } = useContext(CancelOfferModalContext);
    const { show, sendCancel, onHide, onSuccess, onFail } = cancelProps;
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>There are reservations for this day</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to cancel?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => sendCancel().then(onSuccess).catch(onFail)}
                    variant='primary'
                >
                    Yes
                </Button>
                <Button onClick={onHide} variant='secondary'>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
