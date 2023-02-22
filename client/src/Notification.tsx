import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { SERVER_ADDR } from './config';
import { User } from './types';

export function UserIcon() {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='2em'
            height='2em'
            fill='currentColor'
            viewBox='0 0 16 16'
        >
            <path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' />
        </svg>
    );
}

function UnreadMailIcon() {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='2em'
            height='2em'
            fill='currentColor'
            viewBox='0 0 16 16'
        >
            <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 4.697v4.974A4.491 4.491 0 0 0 12.5 8a4.49 4.49 0 0 0-1.965.45l-.338-.207L16 4.697Z' />
            <path d='M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1.5a.5.5 0 0 1-1 0V11a.5.5 0 0 1 1 0Zm0 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z' />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='2em'
            height='2em'
            fill='currentColor'
            viewBox='0 0 16 16'
        >
            <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z' />
        </svg>
    );
}

function getNotificationsArray(messages) {
    console.log('getNotificationsArray called.');
    return messages.map((msg) => <NavDropdown.Item key={msg._id}>{msg.text}</NavDropdown.Item>);
}

interface MailDropdownProps {
    userId: String;
}
export function MailDropdown(props: MailDropdownProps) {
    const { userId } = props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function func() {
            const messageResponse = await axios.get(`${SERVER_ADDR}/notify/to/${userId}`);
            console.log(messageResponse);
            setMessages(messageResponse.data);
        }
        func();
    }, [userId]);

    const messageNavbarItems = getNotificationsArray(messages);

    return (
        <NavDropdown
            title={messages.length === 0 ? MailIcon() : UnreadMailIcon()}
            id='notifications'
        >
            {messageNavbarItems}
        </NavDropdown>
    );
}

// TODO: fix hvr-grow problem
// TODO: disable when no notifications to show
// TODO: grey out when leave hover
