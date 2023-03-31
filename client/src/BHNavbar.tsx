import { Row, Navbar, Nav, Container } from 'react-bootstrap';
import { MailDropdown } from './MailDropdown';
import UserNavDropdown from './UserNavDropdown';
import InfoButton from './InfoButton';

export default function BHNavbar(props) {
    const { user, setUser, isLoggedIn } = props;
    let navbarRows;
    if (isLoggedIn) {
        navbarRows = (
            <>
                <Row>
                    <InfoButton isLoggedIn={isLoggedIn} />
                </Row>
                <Row>
                    <MailDropdown userId={user} />
                </Row>
                <Row>
                    <UserNavDropdown setUser={setUser} />
                </Row>
            </>
        );
    } else {
        navbarRows = (
            <>
                <Row>
                    <InfoButton isLoggedIn={isLoggedIn} />
                </Row>
            </>
        );
    }
    return (
        <Navbar bg='light'>
            <Container>
                <Navbar.Brand href='#home'>Balmoral House Post Collective</Navbar.Brand>
                <Nav style={{ maxHeight: '100px' }} navbarScroll>
                    {navbarRows}
                </Nav>
            </Container>
        </Navbar>
    );
}
