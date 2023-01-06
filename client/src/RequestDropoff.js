import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export function RequestDropoff(props) {
    const { unselect, toggle, availability } = props;
    const [modalShow, setModalShow] = useState(false);
    if (availability.state) {
        return (
            <>
                <div
                    className='select-box bg-white text-grey hvr-grow2'
                    onClick={() => {
                        setModalShow(true);
                        // TODO: make API request for requested day
                    }}
                >
                    Request Drop-off
                </div>
                <SelectDropoffModal
                    data={availability.data}
                    show={modalShow}
                    onHide={() => {
                        unselect();
                        setModalShow(false);
                    }}
                    toggle={toggle}
                />
            </>
        );
    }
    return (
        <>
            <div className='select-box bg-white text-grey disabled'>Request Drop-off</div>
        </>
    );
}

function SelectDropoffModal(props) {
    const { data, show, onHide, toggle } = props;
    const buttons = data.map((offerData) => {
        return (
            <Button
                key={offerData.user.aptNum}
                onClick={() => {
                    console.log(`apt ${offerData.user.aptNum} clicked`);
                    toggle();
                }}
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
