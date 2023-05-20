import axios from 'axios';

import { getConfig } from '../utils/auth';
import { ToggleOfferedFunction } from '../utils/types';
import { useContext } from 'react';
import { ErrorModalContext } from '../context/ActionModalContext';

function sendPickupOffer(token: string, date: string) {
    return axios.put(
        `${process.env.REACT_APP_API_ENDPOINT}/offered`,
        { date: date },
        getConfig(token)
    );
}

interface OfferPickupButtonProps {
    token: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}
export function OfferPickupButton({ token, date, toggleOffered }: OfferPickupButtonProps) {
    const { setErrorProps } = useContext(ErrorModalContext);

    const onSuccess = (response) => toggleOffered(response.data);
    const onFail = (err) => {
        setErrorProps((oldValues) => ({
            ...oldValues,
            show: true,
            message: 'Something went wrong, please try again later.',
            onHide: () => {
                setErrorProps((oldValues) => ({ ...oldValues, show: false }));
            },
        }));
    };
    return (
        <div
            className='select-box text-grey hvr-grow2 bottom-btn'
            onClick={() => sendPickupOffer(token, date).then(onSuccess).catch(onFail)}
        >
            Offer Pickup
        </div>
    );
}
