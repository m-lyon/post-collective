import { RequestResponse } from './types';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import { useState } from 'react';

interface RequestDisplayProps {
    userRequests: RequestResponse[];
    unselect: () => void;
}
export function RequestDisplay({ userRequests, unselect }: RequestDisplayProps) {
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
    userRequests: RequestResponse[];
    show: boolean;
    onHide: () => void;
}
function ViewRequestsModal(props: ViewRequestsModalProps) {
    const { userRequests, show, onHide } = props;
    const aptList = userRequests.map((request) => {
        return <Row key={request.user.aptNum}>{request.user.aptNum}</Row>;
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
