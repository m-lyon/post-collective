import { AvailableDay, Offer, Request, RequestResponse, ToggleRequestedFunction } from './types';
import { CancelRequestButton, RequestDropoffButton } from './RequestDropoff';
import { RequestDisplay } from './RequestDisplay';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';

interface TopButtonProps {
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    availability: AvailableDay;
    requested: Request;
    offered: Offer;
    userRequests: RequestResponse[];
}
export function TopButton(props: TopButtonProps) {
    const { unselect, toggleRequested, availability, requested, offered, userRequests } = props;
    const [userContext] = useContext(UserContext);

    if (offered !== null) {
        return <RequestDisplay userRequests={userRequests} unselect={unselect} />;
    }
    if (requested !== null) {
        return (
            <CancelRequestButton
                token={userContext.token}
                request={requested}
                toggleRequested={toggleRequested}
            />
        );
    }
    if (availability.length !== 0) {
        return (
            <RequestDropoffButton
                token={userContext.token}
                unselect={unselect}
                toggleRequested={toggleRequested}
                offers={availability}
            />
        );
    }
    // TODO: need to change text of "No Drop-offs", to "No Drop-offs Available", need to change
    // the css of text so its not ugly.
    return (
        <>
            <div className='select-box bg-white text-grey disabled'>No Drop-offs</div>
        </>
    );
}