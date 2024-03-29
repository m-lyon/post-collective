import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Dispatch, SetStateAction } from 'react';
import { Message } from '../utils/types';
import { getConfig } from '../utils/auth';
import { UserContext } from '../context/UserContext';
import { EnvelopeFill } from 'react-bootstrap-icons';
import { EnvelopeExclamationFill } from 'react-bootstrap-icons';

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
        await axios.patch(
            `${process.env.REACT_APP_API_ENDPOINT}/notify/${msg._id}`,
            { seen: true },
            getConfig(token)
        );
    } catch (err) {}
}

function MessageItem(props: { token: string; msg: Message; updateMessages }) {
    const { token, msg, updateMessages } = props;

    if (msg.seen) {
        return (
            <NavDropdown.Item className='info-box message-item read-message'>
                <div className='notification-circle'>
                    <NotificationCircle color='#F4F6F7' />
                </div>
                <div style={{ width: '8em' }}>{msg.text}</div>
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
            <div style={{ width: '8em' }}>{msg.text}</div>
        </NavDropdown.Item>
    );
}

async function fetchMessages(
    token: string,
    setMessages: Dispatch<SetStateAction<Message[]>>,
    maxNum: number,
    setAvail: Dispatch<SetStateAction<boolean>>
) {
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

    useEffect(() => {
        // Set number of unread
        setNumUnread(messages.filter((msg: Message) => !msg.seen).length);
    }, [messages]);

    useEffect(() => {
        if (userContext.token && userContext.details.isVerified) {
            fetchMessages(userContext.token, setMessages, displayedNum, setAvail);
        }
    }, [userContext.token, userContext.details, displayedNum]);

    useEffect(() => {
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
            title={
                numUnread === 0 ? (
                    <EnvelopeFill size='2em' className='hvr-grow3' />
                ) : (
                    <EnvelopeExclamationFill size='2em' className='hvr-grow3' />
                )
            }
            id='notifications'
            align='end'
            disabled={messages.length === 0}
            autoClose='outside'
        >
            <div className='messages'>{navbarItems}</div>
        </NavDropdown>
    );
}
