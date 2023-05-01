import axios from 'axios';

import { Button } from 'react-bootstrap';
import { useSubmit } from '../hooks/useSubmit';
import { getConfig } from '../utils/auth';
import { Offer, Request } from '../utils/types';

function sendReservationHandler(
    token: string,
    offer: Offer,
    onSuccess: (data: Request) => void,
    onFail: (err) => void
) {
    return axios
        .put(
            `${process.env.REACT_APP_API_ENDPOINT}/requested/${offer.date}`,
            { offeredDateId: offer._id },
            getConfig(token)
        )
        .then((res) => onSuccess(res.data))
        .catch((err) => onFail(err));
}

export function DropoffButton(props) {
    const { token, offer, onSuccess, onFail } = props;
    const { isSubmitting, hasSubmitted, handleSubmit } = useSubmit();

    return (
        <Button
            variant='success'
            className='request-btn'
            key={offer.user.aptNum}
            onClick={() => {
                handleSubmit(() => sendReservationHandler(token, offer, onSuccess, onFail));
            }}
            disabled={isSubmitting || hasSubmitted}
        >
            {isSubmitting ? 'Sending reservation...' : `Apartment ${offer.user.aptNum}`}
        </Button>
    );
}
