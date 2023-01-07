import { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

async function sendDropoffRequest(offerData, user, toggleRequested, setModalShow) {
    try {
        const response = await axios.put(`http://localhost:9000/requested/${offerData.date}`, {
            user: user,
            offeredDateId: offerData._id,
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

export function RequestDropoff(props) {
    const { user, unselect, toggleRequested, availability, requested } = props;
    const [modalShow, setModalShow] = useState(false);
    if (requested.state) {
        return (
            <>
                <div className='select-box bg-white text-grey hvr-grow2'>Cancel Request</div>
            </>
        );
    }
    if (availability.state) {
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
                    data={availability.data}
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
    return (
        <>
            <div className='select-box bg-white text-grey disabled'>No Drop-offs</div>
        </>
    );
    // TODO: need to change text of "No Drop-offs", to "No Drop-offs Available", need to change
    // the css of text so its not ugly.
}

function SelectDropoffModal(props) {
    const { user, data, show, onHide, toggleRequested, setModalShow } = props;
    const buttons = data.map((offerData) => {
        return (
            <Button
                key={offerData.user.aptNum}
                onClick={() => sendDropoffRequest(offerData, user, toggleRequested, setModalShow)}
            >
                Apartment {offerData.user.aptNum}
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
