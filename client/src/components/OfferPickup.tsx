import axios from 'axios';

import { getConfig } from '../utils/auth';
import { ToggleOfferedFunction } from '../utils/types';

async function sendPickupOffer(token: string, date: string, toggleOffered: ToggleOfferedFunction) {
    console.log('sendPickupOffer called');
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_ENDPOINT}/offered`,
            { date: date },
            getConfig(token)
        );
        toggleOffered(response.data);
    } catch (err) {
        console.log('error', err);
    }
}

interface OfferPickupButtonProps {
    token: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}
export function OfferPickupButton({ token, date, toggleOffered }: OfferPickupButtonProps) {
    return (
        <div
            className='select-box text-grey hvr-grow2 bottom-btn'
            onClick={() => sendPickupOffer(token, date, toggleOffered)}
        >
            Offer Pickup
        </div>
    );
}
