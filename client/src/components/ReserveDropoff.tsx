import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Offer, Request, ToggleRequestedFunction } from '../utils/types';
import { getConfig } from '../utils/auth';

async function sendReservationHandler(
    token: string,
    offer: Offer,
    handleSuccess: (data: Request) => void
) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_ENDPOINT}/requested/${offer.date}`,
            { offeredDateId: offer._id },
            getConfig(token)
        );
        console.log(response);
        handleSuccess(response.data);
    } catch (err) {
        console.log(err);
    }
}

async function cancelReservationHandler(
    token: string,
    request: Request,
    toggleRequested: ToggleRequestedFunction
) {
    console.log(request);
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_ENDPOINT}/requested/${request._id}`,
            getConfig(token)
        );
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface ReserveDropoffButtonProps {
    token: string;
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    offers: Offer[];
    showSuccessModal: () => void;
}
export function ReserveDropoffButton(props: ReserveDropoffButtonProps) {
    const { token, unselect, toggleRequested, offers, showSuccessModal } = props;
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div
                className='select-box text-grey hvr-grow2'
                onClick={() => {
                    setModalShow(true);
                }}
            >
                Reserve Drop-off
            </div>
            <SelectDropoffModal
                token={token}
                offers={offers}
                show={modalShow}
                onHide={() => {
                    unselect();
                    setModalShow(false);
                }}
                handleSuccess={(data) => {
                    toggleRequested(data);
                    showSuccessModal();
                    unselect();
                }}
            />
        </>
    );
}

interface SelectDropoffModalProps {
    token: string;
    offers: Offer[];
    show: boolean;
    onHide: () => void;
    handleSuccess: (data: Request) => void;
}
function SelectDropoffModal(props: SelectDropoffModalProps) {
    const { token, offers, show, onHide, handleSuccess } = props;

    const buttons = offers.map((offer: Offer) => {
        return (
            <Button
                variant='success'
                className='request-btn'
                key={offer.user.aptNum}
                onClick={() => sendReservationHandler(token, offer, handleSuccess)}
            >
                Apartment {offer.user.aptNum}
            </Button>
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

interface CancelReservationButtonProps {
    token: string;
    toggleRequested: ToggleRequestedFunction;
    request: Request;
}

export function CancelReservationButton(props: CancelReservationButtonProps) {
    const { token, toggleRequested, request } = props;
    return (
        <div
            className='select-box text-grey hvr-grow2'
            onClick={() => cancelReservationHandler(token, request, toggleRequested)}
        >
            Cancel Request
        </div>
    );
}
