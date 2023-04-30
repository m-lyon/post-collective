import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { getConfig } from '../utils/auth';
import { Offer, ToggleOfferedFunction, SetModalShowFunction } from '../utils/types';

async function sendPickupOffer(token: string, date: string, toggleOffered: ToggleOfferedFunction) {
    console.log('sendPickupOffer called');
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_ENDPOINT}/offered`,
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
            `${process.env.REACT_APP_API_ENDPOINT}/offered/${offer._id}`,
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
            className='select-box text-grey hvr-grow2 bottom-btn'
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
                className='select-box text-grey hvr-grow2 bottom-btn'
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

/**
 * Checks to see if there is outstanding requests on a given offer, and prompts user
 * with modal if there are outstanding requests.
 * @param token
 * @param offer
 * @param toggleOffered
 * @param setModalShow
 */
async function cancelOfferHandler(
    token: string,
    offer: Offer,
    toggleOffered: ToggleOfferedFunction,
    setModalShow: SetModalShowFunction
) {
    const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/requested`,
        getConfig(token, { offeredDateId: offer })
    );
    if (response.data.length !== 0) {
        setModalShow(true);
    } else {
        sendOfferCancel(token, offer, toggleOffered);
    }
}
