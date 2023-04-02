import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState } from 'react';
import { Offer, Request, ToggleRequestedFunction } from './types';
import { getConfig } from './utils';

async function dropoffRequestHandler(
    token: string,
    offer: Offer,
    toggleRequested: ToggleRequestedFunction
) {
    try {
        const response = await axios.put(
            `${process.env.SERVER_ADDR}/requested/${offer.date}`,
            { offeredDateId: offer._id },
            getConfig(token)
        );
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
        // TODO: this is here just to show the data structure
        if (err.response.data.message === 'already-requested') {
            console.log('day already requested');
        }
    }
}

async function cancelDropoffHandler(
    token: string,
    request: Request,
    toggleRequested: ToggleRequestedFunction
) {
    console.log(request);
    try {
        const response = await axios.delete(
            `${process.env.SERVER_ADDR}/requested/${request._id}`,
            getConfig(token)
        );
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface RequestDropoffButtonProps {
    token: string;
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    offers: Offer[];
}
export function RequestDropoffButton(props: RequestDropoffButtonProps) {
    const [modalShow, setModalShow] = useState(false);
    const { token, unselect, toggleRequested, offers } = props;
    return (
        <>
            <div
                className='select-box bg-white text-grey hvr-grow2'
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
                toggleRequested={toggleRequested}
            />
        </>
    );
}

interface SelectDropoffModalProps {
    token: string;
    offers: Offer[];
    show: boolean;
    onHide: () => void;
    toggleRequested: ToggleRequestedFunction;
}
function SelectDropoffModal(props: SelectDropoffModalProps) {
    const { token, offers, show, onHide, toggleRequested } = props;
    const buttons = offers.map((offer: Offer) => {
        return (
            <Button
                key={offer.user.aptNum}
                onClick={() => {
                    dropoffRequestHandler(token, offer, toggleRequested);
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
                <Modal.Title>Reserve Drop-off</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ marginBottom: '2em' }}>
                    Select an apartment that you would like to collect your post
                </div>
                <ButtonGroup vertical>{buttons}</ButtonGroup>
            </Modal.Body>
        </Modal>
    );
}

interface CancelRequestButtonProps {
    token: string;
    toggleRequested: ToggleRequestedFunction;
    request: Request;
}

export function CancelRequestButton(props: CancelRequestButtonProps) {
    const { token, toggleRequested, request } = props;
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => cancelDropoffHandler(token, request, toggleRequested)}
        >
            Cancel Request
        </div>
    );
}
