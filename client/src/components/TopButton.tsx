import { AvailableDay, Offer, Request, ToggleRequestedFunction } from '../utils/types';
import { ReserveDropoffButton } from './ReserveDropoff';
import { PickupDisplay } from './PickupDisplay';
import { RequestDisplay } from './RequestDisplay';

interface TopButtonProps {
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    availability: AvailableDay;
    request: Request;
    offer: Offer;
    userRequests: Request[];
}
export function TopButton(props: TopButtonProps) {
    const { unselect, toggleRequested, availability, request, offer, userRequests } = props;

    if (offer !== null) {
        return <PickupDisplay userRequests={userRequests} unselect={unselect} />;
    }
    if (request !== null) {
        return <RequestDisplay offer={request.offeredDate} unselect={unselect} />;
    }
    if (availability.length !== 0) {
        return <ReserveDropoffButton toggleRequested={toggleRequested} offers={availability} />;
    }
    return (
        <>
            <div className='select-box text-grey disabled'>No Drop-offs</div>
        </>
    );
}
