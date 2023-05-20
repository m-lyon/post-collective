import axios from 'axios';

import { Request, ToggleRequestedFunction } from '../utils/types';
import { getConfig } from '../utils/auth';
import { useContext } from 'react';
import { ErrorModalContext } from '../context/ActionModalContext';

function cancelDropoffHandler(token: string, request: Request) {
    return axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/requested/${request._id}`,
        getConfig(token)
    );
}

interface CancelDropoffButtonProps {
    token: string;
    toggleRequested: ToggleRequestedFunction;
    request: Request;
}

export function CancelDropoffButton(props: CancelDropoffButtonProps) {
    const { token, toggleRequested, request } = props;
    const { setErrorProps } = useContext(ErrorModalContext);

    const onSuccess = (response) => toggleRequested(response.data);
    const onFail = (err) => {
        setErrorProps((oldValues) => ({
            ...oldValues,
            show: true,
            message: 'Something went wrong, please try again later.',
            onHide: () => {
                setErrorProps((oldValues) => ({ ...oldValues, show: false }));
            },
        }));
    };
    return (
        <div
            className='select-box text-grey hvr-grow2'
            onClick={() => cancelDropoffHandler(token, request).then(onSuccess).catch(onFail)}
        >
            Cancel Drop-off
        </div>
    );
}
