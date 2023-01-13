import axios from 'axios';
import { RequestedDay, ToggleOfferedFunction } from './types';

async function sendPickupOffer(user: string, date: string, toggleOffered: ToggleOfferedFunction) {
    try {
        const response = await axios.put(`http://localhost:9000/offered/${date}`, {
            user: user,
        });
        console.log(response);
        toggleOffered();
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
        toggleOffered();
    } catch (err) {
        console.log(err);
    }
}

interface OfferButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
    requested: RequestedDay;
    offered: boolean;
}
export function OfferButton(props: OfferButtonProps) {
    const { user, date, toggleOffered, requested, offered } = props;
    if (requested.state) {
        return <div className='select-box bg-white text-grey disabled'>Offer Pickup</div>;
    }
    if (offered) {
        return <CancelOfferButton user={user} date={date} toggleOffered={toggleOffered} />;
    }
    return <OfferPickupButton user={user} date={date} toggleOffered={toggleOffered} />;
}

interface OfferPickupButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
}
function OfferPickupButton({ user, date, toggleOffered }: OfferPickupButtonProps) {
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

function CancelOfferButton({ user, date, toggleOffered }: CancelOfferButtonProps) {
    return (
        <div
            className='select-box bg-white text-grey hvr-grow2'
            onClick={() => sendOfferCancel(user, date, toggleOffered)}
        >
            Cancel Offer
        </div>
    );
}
