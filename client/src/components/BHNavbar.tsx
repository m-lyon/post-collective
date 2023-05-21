import { Row, Navbar, Nav, Container } from 'react-bootstrap';
import { MailDropdown } from './MailDropdown';
import { UserNavDropdown } from './UserNavDropdown';
import { InfoButton } from './InfoButton';
import { useContext } from 'react';
import { DisplayContext } from '../context/DisplayContext';

export function BHNavbar(props) {
    const isMobile = useContext(DisplayContext);
    return (
        <Navbar bg='light'>
            <Container>
                <Navbar.Brand href='#home'>
                    {isMobile ? 'BH Postal Collective' : 'Balmoral House Postal Collective'}
                </Navbar.Brand>
                <Nav style={{ maxHeight: '100px' }} navbarScroll>
                    <Row>
                        <InfoButton />
                    </Row>
                    <Row>
                        <MailDropdown />
                    </Row>
                    <Row>
                        <UserNavDropdown />
                    </Row>
                </Nav>
            </Container>
        </Navbar>
    );
}
