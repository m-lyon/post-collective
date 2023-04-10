import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Dispatch, SetStateAction } from 'react';
import { Message } from '../utils/types';
import { getConfig } from '../utils/auth';
import { UserContext } from '../context/UserContext';

function UnreadMailIcon() {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='2em'
            height='2em'
            fill='currentColor'
            viewBox='0 0 16 16'
            className='hvr-grow3'
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
            className='hvr-grow3'
        >
            <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z' />
        </svg>
    );
}

function NotificationCircle(props) {
    const { color, className } = props;
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='12'
            height='12'
            fill={color}
            className={className}
            viewBox='0 0 16 16'
        >
            <circle cx='6' cy='6' r='6' />
        </svg>
    );
}

async function setMessageAsSeen(token: string, msg: Message) {
    try {
        const res = await axios.patch(
            `${process.env.REACT_APP_API_ENDPOINT}/notify/${msg._id}`,
            { seen: true },
            getConfig(token)
        );
        console.log(res);
    } catch (err) {
        console.log('error', err);
    }
}

function MessageItem(props: { token: string; msg: Message; updateMessages }) {
    const { token, msg, updateMessages } = props;

    if (msg.seen) {
        return (
            <NavDropdown.Item className='info-box message-item read-message'>
                <div className='notification-circle'>
                    <NotificationCircle color='#F4F6F7' />
                </div>
                <div>{msg.text}</div>
            </NavDropdown.Item>
        );
    }
    return (
        <NavDropdown.Item
            className='info-box message-item unread-message'
            onMouseEnter={async () => {
                await setMessageAsSeen(token, msg);
                await updateMessages();
            }}
        >
            <div className='notification-circle'>
                <NotificationCircle color='currentColor' />
            </div>
            <div>{msg.text}</div>
        </NavDropdown.Item>
    );
}

async function fetchMessages(
    token: string,
    setMessages: Dispatch<SetStateAction<Message[]>>,
    maxNum: number,
    setAvail: Dispatch<SetStateAction<boolean>>
) {
    console.log(`fetching ${maxNum} messages.`);
    const messageResponse = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/notify`,
        getConfig(token, { length: maxNum })
    );
    setMessages(messageResponse.data.messages);
    setAvail(messageResponse.data.hasMore);
}

function Ellipsis(props) {
    const { displayedNum, setDisplayedNum } = props;
    let nextNum: number;
    if (displayedNum === 3) {
        nextNum = 10;
    } else {
        nextNum = displayedNum + 10;
    }
    return (
        <NavDropdown.Item
            className='ellipsis'
            onClick={() => {
                console.log('now', displayedNum, 'next', nextNum);
                setDisplayedNum(nextNum);
            }}
        >
            ...
        </NavDropdown.Item>
    );
}

interface MailDropdownProps {
    // userId: string;
}
export function MailDropdown(props: MailDropdownProps) {
    const [messages, setMessages] = useState([]);
    const [numUnread, setNumUnread] = useState(0);
    const [displayedNum, setDisplayedNum] = useState(3);
    const [navbarItems, setNavbarItems] = useState([]);
    const [moreAvail, setAvail] = useState(true);
    const [userContext] = useContext(UserContext);

    // TODO: check that this logic is not required when logging in and out of different
    // user accounts
    // useEffect(() => {
    //     // reset for different user
    //     setDisplayedNum(3);
    //     setAvail(true);
    // }, [userId]);

    useEffect(() => {
        // Set number of unread
        setNumUnread(messages.filter((msg: Message) => !msg.seen).length);
    }, [messages]);

    useEffect(() => {
        if (userContext.token) {
            fetchMessages(userContext.token, setMessages, displayedNum, setAvail);
        }
    }, [userContext.token, displayedNum]);

    useEffect(() => {
        console.log('getMessageNavbarItems has been called.');
        const messageNavbarItems = messages.map((msg) => (
            <MessageItem
                token={userContext.token}
                msg={msg}
                key={msg._id}
                updateMessages={() =>
                    fetchMessages(userContext.token, setMessages, displayedNum, setAvail)
                }
            />
        ));
        if (moreAvail) {
            messageNavbarItems.push(
                <Ellipsis
                    key='ellipsis'
                    displayedNum={displayedNum}
                    setDisplayedNum={setDisplayedNum}
                />
            );
        }
        setNavbarItems(messageNavbarItems);
    }, [userContext.token, messages, displayedNum, moreAvail]);

    return (
        <NavDropdown
            title={numUnread === 0 ? MailIcon() : UnreadMailIcon()}
            id='notifications'
            align='end'
            className='notification'
            disabled={messages.length === 0}
            autoClose='outside'
        >
            <div className='messages'>{navbarItems}</div>
        </NavDropdown>
    );
}
