import { Offer, Request, ToggleOfferedFunction } from '../utils/types';
import { OfferPickupButton, CancelOfferButton } from './OfferPickup';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

interface BottomButtonProps {
    date: string;
    toggleOffered: ToggleOfferedFunction;
    request: Request;
    offer: Offer;
    unselect: () => void;
}
export function BottomButton(props: BottomButtonProps) {
    const { date, toggleOffered, request, offer, unselect } = props;
    const [userContext] = useContext(UserContext);

    if (request !== null) {
        return <div className='select-box bg-white text-grey disabled'>Offer Pickup</div>;
    }
    if (offer !== null) {
        return (
            <CancelOfferButton
                token={userContext.token}
                offer={offer}
                toggleOffered={toggleOffered}
                unselect={unselect}
            />
        );
    }
    return (
        <OfferPickupButton token={userContext.token} date={date} toggleOffered={toggleOffered} />
    );
}
