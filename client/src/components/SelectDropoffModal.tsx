import { Modal } from 'react-bootstrap';
import { useContext } from 'react';
import { Offer } from '../utils/types';

import { UserContext } from '../context/UserContext';
import { DropoffButton } from './DropoffButton';
import { DropoffModalContext } from '../context/ReservationModalContext';

export function SelectDropoffModal(props) {
    const [userContext] = useContext(UserContext);
    const { dropoffProps } = useContext(DropoffModalContext);
    const { offers, show, onHide, onSuccess, onFail } = dropoffProps;

    const buttons = offers.map((offer: Offer) => {
        return (
            <DropoffButton
                key={offer._id}
                token={userContext.token}
                offer={offer}
                onSuccess={onSuccess}
                onFail={onFail}
            />
        );
    });
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reserve Drop-off</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ marginBottom: '2em' }}>
                    Select an apartment that you would like to collect your post.
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>{buttons}</div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
