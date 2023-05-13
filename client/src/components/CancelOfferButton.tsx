import axios from 'axios';

import { useContext } from 'react';
import { getConfig } from '../utils/auth';
import { Offer, ToggleOfferedFunction } from '../utils/types';
import { ErrorModalContext, SuccessModalContext } from '../context/ActionModalContext';
import { CancelOfferModalContext } from '../context/ReservationModalContext';

function sendOfferCancel(token: string, offer: Offer) {
    return axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/offered/${offer._id}`,
        getConfig(token)
    );
}

interface CancelOfferButtonProps {
    token: string;
    offer: Offer;
    toggleOffered: ToggleOfferedFunction;
}
export function CancelOfferButton(props: CancelOfferButtonProps) {
    const { token, offer, toggleOffered } = props;
    const { setErrorProps } = useContext(ErrorModalContext);
    const { setSuccessProps } = useContext(SuccessModalContext);
    const { setCancelProps } = useContext(CancelOfferModalContext);

    return (
        <div
            className='select-box text-grey hvr-grow2 bottom-btn'
            onClick={async () => {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_ENDPOINT}/requested`,
                    getConfig(token, { offeredDateId: offer })
                );
                if (response.data.length !== 0) {
                    let msg: string;
                    if (response.data.length > 1) {
                        msg = 'reservation holders have';
                    } else {
                        msg = 'reservation holder has';
                    }
                    setCancelProps((oldValues) => ({
                        ...oldValues,
                        show: true,
                        sendCancel: () => sendOfferCancel(token, offer),
                        onSuccess: (res) => {
                            setSuccessProps((oldValues) => ({
                                ...oldValues,
                                show: true,
                                message: `Offer cancelled. The ${msg} been notified.`,
                                onHide: () => {
                                    setSuccessProps((oldValues) => ({
                                        ...oldValues,
                                        show: false,
                                    }));
                                    setCancelProps((oldValues) => ({ ...oldValues, show: false }));
                                },
                            }));
                            toggleOffered(res.data);
                        },
                        onFail: (err) => {
                            setErrorProps((oldValues) => ({
                                ...oldValues,
                                show: true,
                                message: 'Something went wrong, please try again later.',
                                onHide: () => {
                                    setErrorProps((oldValues) => ({ ...oldValues, show: false }));
                                    setCancelProps((oldValues) => ({ ...oldValues, show: false }));
                                },
                            }));
                        },
                        onHide: () => {
                            setCancelProps((oldValues) => ({ ...oldValues, show: false }));
                        },
                    }));
                } else {
                    sendOfferCancel(token, offer)
                        .then((res) => toggleOffered(res.data))
                        .catch((err) => {
                            setErrorProps((oldValues) => ({
                                ...oldValues,
                                show: true,
                                message: 'Something went wrong, please try again later.',
                                onHide: () => {
                                    setErrorProps((oldValues) => ({ ...oldValues, show: false }));
                                },
                            }));
                        });
                }
            }}
        >
            Cancel Offer
        </div>
    );
}
