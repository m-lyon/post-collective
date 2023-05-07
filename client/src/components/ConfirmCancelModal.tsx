import { Modal, Button } from 'react-bootstrap';
import { SetModalShowFunction } from '../utils/types';

interface ConfirmCancelModalProps {
    show: boolean;
    sendCancel: () => void;
    setModalShow: SetModalShowFunction;
    unselect: () => void;
}
export function ConfirmCancelModal(props: ConfirmCancelModalProps) {
    const { show, sendCancel, setModalShow, unselect } = props;
    const hide = () => {
        unselect();
        setModalShow(false);
    };
    return (
        <Modal show={show} onHide={hide} centered>
            <Modal.Header closeButton>
                <Modal.Title>There are reservations for this day</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to cancel?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        sendCancel();
                        unselect();
                    }}
                    variant='primary'
                >
                    Yes
                </Button>
                <Button onClick={hide} variant='secondary'>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
