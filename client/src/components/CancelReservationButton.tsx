import axios from 'axios';

import { Request, ToggleRequestedFunction } from '../utils/types';
import { getConfig } from '../utils/auth';

async function cancelReservationHandler(
    token: string,
    request: Request,
    toggleRequested: ToggleRequestedFunction
) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_ENDPOINT}/requested/${request._id}`,
            getConfig(token)
        );
        toggleRequested(response.data);
    } catch (err) {}
}

interface CancelReservationButtonProps {
    token: string;
    toggleRequested: ToggleRequestedFunction;
    request: Request;
}

export function CancelReservationButton(props: CancelReservationButtonProps) {
    const { token, toggleRequested, request } = props;
    return (
        <div
            className='select-box text-grey hvr-grow2'
            onClick={() => cancelReservationHandler(token, request, toggleRequested)}
        >
            Cancel Request
        </div>
    );
}
