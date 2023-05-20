import { Offer } from '../utils/types';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';

interface RequestDisplayProps {
    offer: Offer;
    unselect: () => void;
}
export function RequestDisplay(props: RequestDisplayProps) {
    const { offer, unselect } = props;
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div className='select-box text-grey hvr-grow2' onClick={() => setModalShow(true)}>
                Show Drop-off
            </div>
            <ViewRequestModal
                offer={offer}
                show={modalShow}
                onHide={() => {
                    unselect();
                    setModalShow(false);
                }}
            />
        </>
    );
}

interface ViewRequestsModalProps {
    offer: Offer;
    show: boolean;
    onHide: () => void;
}
function ViewRequestModal(props: ViewRequestsModalProps) {
    const { offer, show, onHide } = props;
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Drop-off</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Direct your courier to deliver to {offer.user.name} in Apartment {offer.user.aptNum}
                .
            </Modal.Body>
        </Modal>
    );
}
