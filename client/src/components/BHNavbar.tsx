import { Row, Navbar, Nav, Container } from 'react-bootstrap';
import { MailDropdown } from './MailDropdown';
import { UserNavDropdown } from './UserNavDropdown';
import { InfoButton } from './InfoButton';

export function BHNavbar(props) {
    return (
        <Navbar bg='light'>
            <Container>
                <Navbar.Brand href='#home'>Balmoral House Post Collective</Navbar.Brand>
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
