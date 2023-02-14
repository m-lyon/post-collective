import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState } from 'react';
import { SERVER_ADDR } from './config';
import { Offer, Request, ToggleRequestedFunction } from './types';

async function sendDropoffRequest(
    offer: Offer,
    user: string,
    toggleRequested: ToggleRequestedFunction
) {
    try {
        const response = await axios.put(`${SERVER_ADDR}/requested/${offer.date}`, {
            user: user,
            offeredDateId: offer._id,
        });
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
        // TODO: this is here just to show the data structure
        if (err.response.data.error === 'already-requested') {
            console.log('day already requested');
        }
    }
}

async function sendDropoffCancel(request: Request, toggleRequested: ToggleRequestedFunction) {
    console.log(request);
    try {
        const response = await axios.delete(`${SERVER_ADDR}/requested/${request._id}`);
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface RequestDropoffButtonProps {
    user: string;
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    offers: Offer[];
}
export function RequestDropoffButton(props: RequestDropoffButtonProps) {
    const [modalShow, setModalShow] = useState(false);
    const { user, unselect, toggleRequested, offers } = props;
    return (
        <>
            <div
                className='select-box bg-white text-grey hvr-grow2'
                onClick={() => {
                    setModalShow(true);
                }}
            >
                Request Drop-off
            </div>
            <SelectDropoffModal
                user={user}
                offers={offers}
                show={modalShow}
                onHide={() => {
                    unselect();
                    setModalShow(false);
                }}
                toggleRequested={toggleRequested}
            />
        </>
    );
}

interface SelectDropoffModalProps {
    user: string;
    offers: Offer[];
    show: boolean;
    onHide: () => void;
    toggleRequested: ToggleRequestedFunction;
}
function SelectDropoffModal(props: SelectDropoffModalProps) {
    const { user, offers, show, onHide, toggleRequested } = props;
    const buttons = offers.map((offer: Offer) => {
        return (
            <Button
                key={offer.user.aptNum}
                onClick={() => {
                    sendDropoffRequest(offer, user, toggleRequested);
                    onHide();
                }}
            >
                Apartment {offer.user.aptNum}
            </Button>
        );
    });
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request Drop-off at Apartment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ButtonGroup vertical>{buttons}</ButtonGroup>
            </Modal.Body>
        </Modal>
    );
}

interface CancelRequestButtonProps {
    toggleRequested: ToggleRequestedFunction;
    request: Request;
}

export function CancelRequestButton({ toggleRequested, request }: CancelRequestButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendDropoffCancel(request, toggleRequested)}
        >
            Cancel Request
        </div>
    );
}
