import { Offer, Request, ToggleOfferedFunction } from './types';
import { OfferPickupButton, CancelOfferButton } from './OfferPickup';

interface BottomButtonProps {
    user: string;
    date: string;
    toggleOffered: ToggleOfferedFunction;
    request: Request;
    offer: Offer;
}
export function BottomButton(props: BottomButtonProps) {
    const { user, date, toggleOffered, request, offer } = props;
    if (request !== null) {
        return <div className='select-box bg-white text-grey disabled'>Offer Pickup</div>;
    }
    if (offer !== null) {
        return <CancelOfferButton offer={offer} toggleOffered={toggleOffered} />;
    }
    return <OfferPickupButton user={user} date={date} toggleOffered={toggleOffered} />;
}
