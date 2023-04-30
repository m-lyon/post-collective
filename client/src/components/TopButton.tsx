import { AvailableDay, Offer, Request, ToggleRequestedFunction } from '../utils/types';
import { CancelReservationButton, ReserveDropoffButton } from './ReserveDropoff';
import { RequestDisplay } from './RequestDisplay';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

interface TopButtonProps {
    unselect: () => void;
    toggleRequested: ToggleRequestedFunction;
    availability: AvailableDay;
    requested: Request;
    offered: Offer;
    userRequests: Request[];
    showSuccessModal: () => void;
}
export function TopButton(props: TopButtonProps) {
    const {
        unselect,
        toggleRequested,
        availability,
        requested,
        offered,
        userRequests,
        showSuccessModal,
    } = props;
    const [userContext] = useContext(UserContext);

    if (offered !== null) {
        return <RequestDisplay userRequests={userRequests} unselect={unselect} />;
    }
    if (requested !== null) {
        return (
            <CancelReservationButton
                token={userContext.token}
                request={requested}
                toggleRequested={toggleRequested}
            />
        );
    }
    if (availability.length !== 0) {
        return (
            <ReserveDropoffButton
                token={userContext.token}
                unselect={unselect}
                toggleRequested={toggleRequested}
                offers={availability}
                showSuccessModal={showSuccessModal}
            />
        );
    }
    // TODO: need to change text of "No Drop-offs", to "No Drop-offs Available", need to change
    // the css of text so its not ugly.
    return (
        <>
            <div className='select-box text-grey disabled'>No Drop-offs</div>
        </>
    );
}
