import { Request } from '../utils/types';
import { Modal, Container, Row } from 'react-bootstrap';
import { useState } from 'react';

interface RequestDisplayProps {
    userRequests: Request[];
    unselect: () => void;
}
export function RequestDisplay(props: RequestDisplayProps) {
    const { userRequests, unselect } = props;
    const [modalShow, setModalShow] = useState(false);

    if (userRequests.length === 0) {
        return <div className='select-box bg-white text-grey disabled'>0 Requests</div>;
    }
    // put modal nested in div?
    return (
        <>
            <div className='select-box bg-white text-grey' onClick={() => setModalShow(true)}>
                {userRequests.length} Request{userRequests.length === 1 ? '' : 's'}
            </div>
            <ViewRequestsModal
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

interface ViewRequestsModalProps {
    userRequests: Request[];
    show: boolean;
    onHide: () => void;
}
function ViewRequestsModal(props: ViewRequestsModalProps) {
    const { userRequests, show, onHide } = props;
    const aptList = userRequests.map((request) => {
        return (
            <Row key={request.user.aptNum}>
                {request.user.name} in Apartment {request.user.aptNum}
            </Row>
        );
    });
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Current Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>{aptList}</Container>
            </Modal.Body>
        </Modal>
    );
}
