import { useContext } from 'react';
import { Offer, ToggleRequestedFunction } from '../utils/types';
import { ErrorModalContext, SuccessModalContext } from '../context/ActionModalContext';
import { DropoffModalContext } from '../context/ReservationModalContext';

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
                        onSuccess: (request) => {
                            toggleRequested(request);
                            setSuccessProps((oldValues) => ({
                                ...oldValues,
                                show: true,
                                message: `Your reservation has been sent. Please direct your courier to deliver to Apartment ${request.offeredDate.user.aptNum}.`,
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
