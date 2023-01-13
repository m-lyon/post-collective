import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState, Dispatch, SetStateAction } from 'react';
import { AvailableDay, Offer, Request, RequestedDay, ToggleRequestedFunction } from './types';

type SetModalShowFunction = Dispatch<SetStateAction<boolean>>;

async function sendDropoffRequest(
    offer: Offer,
    user: string,
    toggleRequested: ToggleRequestedFunction,
    setModalShow: SetModalShowFunction
) {
    try {
        const response = await axios.put(`http://localhost:9000/requested/${offer.date}`, {
            user: user,
            offeredDateId: offer._id,
        });
        console.log(response);
        toggleRequested(response.data);
        setModalShow(false);
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
        const response = await axios.delete(`http://localhost:9000/requested/${request._id}`);
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface RequestButtonProps {
    user: string;
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    availability: AvailableDay;
    requested: RequestedDay;
    offered: boolean;
}
export function RequestButton(props: RequestButtonProps) {
    const { user, unselect, toggleRequested, availability, requested, offered } = props;
    if (offered) {
        if (availability.state) {
            return <div className='select-box bg-white text-grey disabled'>Request Dropoff</div>;
        } else {
            return <div className='select-box bg-white text-grey disabled'>No Drop-offs</div>;
        }
    }
    if (requested.state) {
        return <CancelRequestButton request={requested.data} toggleRequested={toggleRequested} />;
    }
    if (availability.state) {
        return (
            <RequestDropoffButton
                user={user}
                unselect={unselect}
                toggleRequested={toggleRequested}
                offers={availability.data}
            />
        );
    }
    // TODO: need to change text of "No Drop-offs", to "No Drop-offs Available", need to change
    // the css of text so its not ugly.
    return (
        <>
            <div className='select-box bg-white text-grey disabled'>No Drop-offs</div>
        </>
    );
}

interface RequestDropoffButtonProps {
    user: string;
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    offers: Offer[];
}
function RequestDropoffButton(props: RequestDropoffButtonProps) {
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
                setModalShow={setModalShow}
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
    setModalShow: SetModalShowFunction;
}

function SelectDropoffModal(props: SelectDropoffModalProps) {
    const { user, offers, show, onHide, toggleRequested, setModalShow } = props;
    const buttons = offers.map((offer: Offer) => {
        return (
            <Button
                key={offer.user.aptNum}
                onClick={() => sendDropoffRequest(offer, user, toggleRequested, setModalShow)}
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

function CancelRequestButton({ toggleRequested, request }: CancelRequestButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendDropoffCancel(request, toggleRequested)}
        >
            Cancel Request
        </div>
    );
}
