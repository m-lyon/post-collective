import axios from 'axios';

import { useContext } from 'react';
import { Offer, Request, ToggleRequestedFunction } from '../utils/types';
import { ErrorModalContext, SuccessModalContext } from '../context/ActionModalContext';
import { DropoffModalContext } from '../context/DropoffModalContext';
import { getConfig } from '../utils/auth';

async function cancelReservationHandler(
    token: string,
    request: Request,
    toggleRequested: ToggleRequestedFunction
) {
    console.log(request);
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_ENDPOINT}/requested/${request._id}`,
            getConfig(token)
        );
        console.log(response);
        toggleRequested(response.data);
    } catch (err) {
        console.log(err);
    }
}

interface ReserveDropoffButtonProps {
    toggleRequested: ToggleRequestedFunction;
    offers: Offer[];
}
export function ReserveDropoffButton(props: ReserveDropoffButtonProps) {
    const { toggleRequested, offers } = props;
    const { setSuccessProps } = useContext(SuccessModalContext);
    const { setErrorProps } = useContext(ErrorModalContext);
    const { setDropoffProps } = useContext(DropoffModalContext);

    return (
        <div
            className='select-box text-grey hvr-grow2'
            onClick={() => {
                setDropoffProps((oldValues) => {
                    return {
                        ...oldValues,
                        offers: offers,
                        show: true,
                        onHide: () => {
                            setDropoffProps((oldValues) => ({ ...oldValues, show: false }));
                        },
                        onSuccess: (data) => {
                            toggleRequested(data);
                            setSuccessProps((oldValues) => ({
                                ...oldValues,
                                show: true,
                                message: 'Your reservation has been sent!',
                                onHide: () => {
                                    setSuccessProps((oldValues) => ({ ...oldValues, show: false }));
                                    setDropoffProps((oldValues) => ({ ...oldValues, show: false }));
                                },
                            }));
                        },
                        onFail: (err) => {
                            setErrorProps((oldValues) => ({
                                ...oldValues,
                                show: true,
                                message: 'Something went wrong, please try again later.',
                                onHide: () => {
                                    setErrorProps((oldValues) => ({ ...oldValues, show: false }));
                                    setDropoffProps((oldValues) => ({ ...oldValues, show: false }));
                                },
                            }));
                        },
                    };
                });
            }}
        >
            Reserve Drop-off
        </div>
    );
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
