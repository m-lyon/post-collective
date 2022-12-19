import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export function RequestDropoff(props) {
    const { unselect } = props;
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div
                className='select-box bg-white text-grey hvr-grow2'
                onClick={() => setModalShow(true)}
            >
                Request Drop-off
            </div>
            <SelectDropoffModal
                show={modalShow}
                onHide={() => {
                    unselect();
                    setModalShow(false);
                }}
            />
        </>
    );
}

function SelectDropoffModal(props) {
    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request Drop-off at Apartment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ButtonGroup vertical>
                    <Button onClick={() => console.log('apt 7 clicked')}>Apartment 7</Button>
                    <Button onClick={() => console.log('apt 10 clicked')}>Apartment 10</Button>
                    <Button onClick={() => console.log('apt 22 clicked')}>Apartment 22</Button>
                </ButtonGroup>
            </Modal.Body>
        </Modal>
    );
}
