import { Offer, Request, ToggleOfferedFunction, ToggleRequestedFunction } from '../utils/types';
import { OfferPickupButton } from './OfferPickup';
import { CancelOfferButton } from './CancelOfferButton';
import { CancelDropoffButton } from './CancelDropoffButton';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

interface BottomButtonProps {
    unselect: () => void;
    date: string;
    toggleRequested: ToggleRequestedFunction;
    toggleOffered: ToggleOfferedFunction;
    request: Request;
    offer: Offer;
}
export function BottomButton(props: BottomButtonProps) {
    const { unselect, date, toggleRequested, toggleOffered, request, offer } = props;
    const [userContext] = useContext(UserContext);

    if (request !== null) {
        return (
            <CancelDropoffButton
                unselect={unselect}
                token={userContext.token}
                request={request}
                toggleRequested={toggleRequested}
            />
        );
    }
    if (offer !== null) {
        return (
            <CancelOfferButton
                unselect={unselect}
                token={userContext.token}
                offer={offer}
                toggleOffered={toggleOffered}
            />
        );
    }
    return (
        <OfferPickupButton
            unselect={unselect}
            token={userContext.token}
            date={date}
            toggleOffered={toggleOffered}
        />
    );
}
