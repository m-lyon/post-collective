import { Offer, Request, ToggleOfferedFunction, ToggleRequestedFunction } from '../utils/types';
import { OfferPickupButton } from './OfferPickup';
import { CancelOfferButton } from './CancelOfferButton';
import { CancelDropoffButton } from './CancelDropoffButton';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

interface BottomButtonProps {
    date: string;
    toggleRequested: ToggleRequestedFunction;
    toggleOffered: ToggleOfferedFunction;
    request: Request;
    offer: Offer;
}
export function BottomButton(props: BottomButtonProps) {
    const { date, toggleRequested, toggleOffered, request, offer } = props;
    const [userContext] = useContext(UserContext);

    if (request !== null) {
        return (
            <CancelDropoffButton
                token={userContext.token}
                request={request}
                toggleRequested={toggleRequested}
            />
        );
    }
    if (offer !== null) {
        return (
            <CancelOfferButton
                token={userContext.token}
                offer={offer}
                toggleOffered={toggleOffered}
            />
        );
    }
    return (
        <OfferPickupButton token={userContext.token} date={date} toggleOffered={toggleOffered} />
    );
}
