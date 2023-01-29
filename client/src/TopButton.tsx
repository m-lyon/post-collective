import { AvailableDay, Offer, Request, RequestResponse, ToggleRequestedFunction } from './types';
import { CancelRequestButton, RequestDropoffButton } from './RequestDropoff';
import { RequestDisplay } from './RequestDisplay';

interface TopButtonProps {
    user: string;
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    availability: AvailableDay;
    requested: Request;
    offered: Offer;
    userRequests: RequestResponse[];
}
export function TopButton(props: TopButtonProps) {
    const { user, unselect, toggleRequested, availability, requested, offered, userRequests } =
        props;
    if (offered !== null) {
        return <RequestDisplay userRequests={userRequests} />;
    }
    if (requested !== null) {
        return <CancelRequestButton request={requested} toggleRequested={toggleRequested} />;
    }
    if (availability.length !== 0) {
        return (
            <RequestDropoffButton
                user={user}
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
