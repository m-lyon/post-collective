import { Nav } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useRef } from 'react';

function InfoIcon(props) {
    const { onClick } = props;
    return (
        <div className='info' onClick={onClick}>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='1.7em'
                height='2em'
                fill='currentColor'
                viewBox='0 0 16 16'
                className='hvr-grow3'
            >
                <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' />
            </svg>
        </div>
    );
}

function LoggedInInfoModal(props) {
    const { show, onHide } = props;
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>How It Works</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ marginBottom: '1em' }}>
                    <h5>Reserving a Drop-off</h5>
                </div>
                <ul>
                    <li>
                        The green tiles are days where other people are able to collect post for you
                    </li>
                    <li>Click on 'Reserve Drop-off' to select an apartment to collect your post</li>
                    <li>
                        Next, make sure to let the courier service know which apartment to leave
                        your parcel at
                    </li>
                </ul>
                <div style={{ marginBottom: '1em' }}>
                    <h5>Offering a Pickup</h5>
                </div>
                <ul>
                    <li>
                        Select which days you are able to collect post for other people by clicking
                        'Offer Pickup'
                    </li>
                    <li>You will be notified when someone reserves a drop-off at your apartment</li>
                </ul>
            </Modal.Body>
        </Modal>
    );
}

export function InfoButton(props) {
    const [modalShow, setModalShow] = useState(false);
    const navLinkRef = useRef(null);

    const handleClick = () => {
        setModalShow(true);
    };

    const handleCloseModal = () => {
        setModalShow(false);
        setTimeout(() => navLinkRef.current.blur(), 200);
    };

    return (
        <Nav.Link ref={navLinkRef}>
            <InfoIcon onClick={handleClick} />
            <LoggedInInfoModal show={modalShow} onHide={handleCloseModal} />
        </Nav.Link>
    );
}
