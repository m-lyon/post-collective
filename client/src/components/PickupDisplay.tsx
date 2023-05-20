import { Request } from '../utils/types';
import { Modal, ListGroup } from 'react-bootstrap';
import { useState } from 'react';

interface PickupDisplayProps {
    userRequests: Request[];
    unselect: () => void;
}
export function PickupDisplay(props: PickupDisplayProps) {
    const { userRequests, unselect } = props;
    const [modalShow, setModalShow] = useState(false);

    if (userRequests.length === 0) {
        return <div className='select-box text-grey disabled'>0 Pickups</div>;
    }
    return (
        <>
            <div className='select-box text-grey hvr-grow2' onClick={() => setModalShow(true)}>
                {userRequests.length} Pickup{userRequests.length === 1 ? '' : 's'}
            </div>
            <ViewPickupModal
                userRequests={userRequests}
                show={modalShow}
                onHide={() => {
                    unselect();
                    setModalShow(false);
                }}
            />
        </>
    );
}

interface ViewPickupModalProps {
    userRequests: Request[];
    show: boolean;
    onHide: () => void;
}
function ViewPickupModal(props: ViewPickupModalProps) {
    const { userRequests, show, onHide } = props;
    const aptList = userRequests.map((request) => {
        return (
            <ListGroup.Item key={request.user.aptNum}>
                {request.user.name} in Apartment {request.user.aptNum}
            </ListGroup.Item>
        );
    });
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Current Pickups</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <ListGroup>{aptList}</ListGroup>
                </div>
            </Modal.Body>
        </Modal>
    );
}
