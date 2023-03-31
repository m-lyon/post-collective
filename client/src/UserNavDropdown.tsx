import NavDropdown from 'react-bootstrap/NavDropdown';

export function UserIcon() {
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

export default function UserNavDropdown({ setUser }) {
    return (
        <NavDropdown align='end' title={UserIcon()} id='user-toggle'>
            <NavDropdown.Item className='info-box' onClick={() => setUser('Matt')}>
                Toggle to Matt
            </NavDropdown.Item>
            <NavDropdown.Item className='info-box' onClick={() => setUser('Gooby')}>
                Toggle to Gooby
            </NavDropdown.Item>
        </NavDropdown>
    );
}
