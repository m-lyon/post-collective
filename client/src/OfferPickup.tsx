import axios from 'axios';
import { ToggleOfferedFunction } from './types';

async function sendPickupOffer(user: string, date: string, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.put(`http://localhost:9000/offered/${date}`, {
            user: user,
        });
        console.log(response);
        toggleOffered(response.data);
    } catch (err) {
        console.log(err);
    }
}

async function sendOfferCancel(user: string, date: string, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.delete(`http://localhost:9000/offered/${date}`, {
            data: { user: user },
        });
        console.log(response);
        toggleOffered(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface OfferPickupButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}
export function OfferPickupButton({ user, date, toggleOffered }: OfferPickupButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendPickupOffer(user, date, toggleOffered)}
        >
            Offer Pickup
        </div>
    );
}

interface CancelOfferButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}

export function CancelOfferButton({ user, date, toggleOffered }: CancelOfferButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendOfferCancel(user, date, toggleOffered)}
        >
            Cancel Offer
        </div>
    );
}
