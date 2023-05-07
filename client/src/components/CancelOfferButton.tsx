import axios from 'axios';

import { useContext, useState } from 'react';
import { getConfig } from '../utils/auth';
import { ConfirmCancelModal } from './ConfirmCancelModal';
import { Offer, ToggleOfferedFunction } from '../utils/types';
import { ErrorModalContext, SuccessModalContext } from '../context/ActionModalContext';

function sendOfferCancel(
    token: string,
    offer: Offer,
    toggleOffered: ToggleOfferedFunction,
    setSuccessProps,
    setErrorProps
) {
    axios
        .delete(`${process.env.REACT_APP_API_ENDPOINT}/offered/${offer._id}`, getConfig(token))
        .then((response) => {
            setSuccessProps((oldValues) => ({
                ...oldValues,
                show: true,
                message: 'Offer cancelled. The reservation holders have been notified.',
                onHide: () => {
                    setSuccessProps((oldValues) => ({ ...oldValues, show: false }));
                },
            }));
            toggleOffered(response.data);
        })
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

interface CancelOfferButtonProps {
    token: string;
    offer: Offer;
    toggleOffered: ToggleOfferedFunction;
    unselect: () => void;
}
export function CancelOfferButton(props: CancelOfferButtonProps) {
    const { token, offer, toggleOffered, unselect } = props;
    const [modalShow, setModalShow] = useState(false);
    const { setErrorProps } = useContext(ErrorModalContext);
    const { setSuccessProps } = useContext(SuccessModalContext);

    return (
        <>
            <div
                className='select-box text-grey hvr-grow2 bottom-btn'
                onClick={async () => {
                    const response = await axios.get(
                        `${process.env.REACT_APP_API_ENDPOINT}/requested`,
                        getConfig(token, { offeredDateId: offer })
                    );
                    if (response.data.length !== 0) {
                        setModalShow(true);
                    } else {
                        sendOfferCancel(
                            token,
                            offer,
                            toggleOffered,
                            setSuccessProps,
                            setErrorProps
                        );
                    }
                }}
            >
                Cancel Offer
            </div>
            <ConfirmCancelModal
                show={modalShow}
                sendCancel={() =>
                    sendOfferCancel(token, offer, toggleOffered, setSuccessProps, setErrorProps)
                }
                setModalShow={setModalShow}
                unselect={unselect}
            />
        </>
    );
}
