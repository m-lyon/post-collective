import { Offer, Request, ToggleOfferedFunction } from './types';
import { OfferPickupButton, CancelOfferButton } from './OfferPickup';

interface BottomButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
    requested: Request;
    offered: Offer;
}
export function BottomButton(props: BottomButtonProps) {
    const { user, date, toggleOffered, requested, offered } = props;
    if (requested !== null) {
        return <div className='select-box bg-white text-grey disabled'>Offer Pickup</div>;
    }
    if (offered) {
        return <CancelOfferButton user={user} date={date} toggleOffered={toggleOffered} />;
    }
    return <OfferPickupButton user={user} date={date} toggleOffered={toggleOffered} />;
}
