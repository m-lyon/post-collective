import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { SERVER_ADDR } from './config';
import { Offer, ToggleOfferedFunction, SetModalShowFunction } from './types';

async function sendPickupOffer(user: string, date: string, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.put(`${SERVER_ADDR}/offered/${date}`, {
            user: user,
        });
        console.log(response);
        toggleOffered(response.data);
    } catch (err) {
        console.log('error', err);
    }
}

async function sendOfferCancel(offer: Offer, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.delete(`${SERVER_ADDR}/offered/${offer._id}`);
        console.log(response);
        toggleOffered(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface OfferPickupButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}
export function OfferPickupButton({ user, date, toggleOffered }: OfferPickupButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendPickupOffer(user, date, toggleOffered)}
        >
            Offer Pickup
        </div>
    );
}

interface CancelOfferButtonProps {
    offer: Offer;
    toggleOffered: ToggleOfferedFunction;
    unselect: () => void;
}
export function CancelOfferButton({ offer, toggleOffered, unselect }: CancelOfferButtonProps) {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div
                className='select-box bg-white text-grey hvr-grow2'
                onClick={() => {
                    console.log('CancelOfferButton has been clicked.');
                    handleCancelOffer({
                        offer,
                        toggleOffered,
                        setModalShow,
                    });
                }}
            >
                Cancel Offer
            </div>
            <ConfirmCancelModal
                show={modalShow}
                sendCancel={() => sendOfferCancel(offer, toggleOffered)}
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

/**
 * This function queries the API to see if there are any outstanding requests for the offer,
 * if so, then asks user to confirm choice.
 * @param offer
 * @param toggleOffered
 */
interface HandleCancelOfferProps {
    offer: Offer;
    toggleOffered: ToggleOfferedFunction;
    setModalShow: SetModalShowFunction;
}
async function handleCancelOffer({ offer, toggleOffered, setModalShow }: HandleCancelOfferProps) {
    const response = await axios.get(`${SERVER_ADDR}/requested`, {
        params: { offer: offer },
    });
    if (response.data.length !== 0) {
        setModalShow(true);
    } else {
        sendOfferCancel(offer, toggleOffered);
    }
}
