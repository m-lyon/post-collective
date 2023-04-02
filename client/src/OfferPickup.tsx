import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { getConfig } from './utils';
import { Offer, ToggleOfferedFunction, SetModalShowFunction } from './types';

async function sendPickupOffer(token: string, date: string, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.put(
            `${process.env.SERVER_ADDR}/offered`,
            { date: date },
            getConfig(token)
        );
        console.log(response);
        toggleOffered(response.data);
    } catch (err) {
        console.log('error', err);
    }
}

async function sendOfferCancel(token: string, offer: Offer, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.delete(
            `${process.env.SERVER_ADDR}/offered/${offer._id}`,
            getConfig(token)
        );
        console.log(response);
        toggleOffered(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface OfferPickupButtonProps {
    token: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}
export function OfferPickupButton({ token, date, toggleOffered }: OfferPickupButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendPickupOffer(token, date, toggleOffered)}
        >
            Offer Pickup
        </div>
    );
}

interface CancelOfferButtonProps {
    token: string;
    offer: Offer;
    toggleOffered: ToggleOfferedFunction;
    unselect: () => void;
}
export function CancelOfferButton(props: CancelOfferButtonProps) {
    const { token, offer, toggleOffered, unselect } = props;
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div
                className='select-box bg-white text-grey hvr-grow2'
                onClick={() => {
                    console.log('CancelOfferButton has been clicked.');
                    cancelOfferHandler(token, offer, toggleOffered, setModalShow);
                }}
            >
                Cancel Offer
            </div>
            <ConfirmCancelModal
                show={modalShow}
                sendCancel={() => sendOfferCancel(token, offer, toggleOffered)}
                setModalShow={setModalShow}
                unselect={unselect}
            />
        </>
    );
}

interface ConfirmCancelModalProps {
    show: boolean;
    sendCancel: () => void;
    setModalShow: SetModalShowFunction;
    unselect: () => void;
}
function ConfirmCancelModal(props: ConfirmCancelModalProps) {
    const { show, sendCancel, setModalShow, unselect } = props;
    const hide = () => {
        unselect();
        setModalShow(false);
    };
    return (
        <Modal show={show} onHide={hide} centered>
            <Modal.Header closeButton>
                <Modal.Title>There are active requests for this day</Modal.Title>
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
                <Button onClick={() => hide()} variant='secondary'>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

async function cancelOfferHandler(
    token: string,
    offer: Offer,
    toggleOffered: ToggleOfferedFunction,
    setModalShow: SetModalShowFunction
) {
    const response = await axios.get(
        `${process.env.SERVER_ADDR}/requested`,
        getConfig(token, { offeredDateId: offer })
    );
    if (response.data.length !== 0) {
        setModalShow(true);
    } else {
        sendOfferCancel(token, offer, toggleOffered);
    }
}
