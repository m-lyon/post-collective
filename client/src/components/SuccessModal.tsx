import { Modal } from 'react-bootstrap';

interface SuccessModalProps {
    show: boolean;
    onHide: () => void;
    msg: string;
}
export function SuccessModal(props: SuccessModalProps) {
    const { show, onHide, msg } = props;
    return (
        <Modal show={show} onHide={onHide} onShow={() => console.log('i should be showing')}>
            <Modal.Header closeButton>
                <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>{msg}</Modal.Body>
        </Modal>
    );
}
