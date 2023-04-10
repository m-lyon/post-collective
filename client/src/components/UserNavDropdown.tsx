import axios from 'axios';
import { useCallback, useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { UserContext } from '../context/UserContext';
import { getConfig } from '../utils/auth';

function UserIcon() {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='2em'
            height='2em'
            fill='currentColor'
            viewBox='0 0 16 16'
            className='hvr-grow3'
        >
            <path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' />
        </svg>
    );
}

export function UserNavDropdown(props) {
    const [userContext, setUserContext] = useContext(UserContext);

    const logoutHandler = useCallback(() => {
        axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/users/logout`, getConfig(userContext.token))
            .then(async (res) => {
                setUserContext((oldValues) => {
                    return { ...oldValues, details: undefined, token: null };
                });
                window.localStorage.setItem('logout', `${Date.now()}`);
            });
    }, [userContext.token, setUserContext]);

    return (
        <NavDropdown align='end' title={UserIcon()} id='user-toggle'>
            <NavDropdown.Item className='info-box' onClick={logoutHandler}>
                Logout
            </NavDropdown.Item>
        </NavDropdown>
    );
}
