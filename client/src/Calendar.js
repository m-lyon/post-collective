import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDay } from './CalendarDay.js';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from 'react-bootstrap';

const calendarDaysList = [
    ['Mon 28/11', false],
    ['Tue 29/11', false],
    ['Wed 30/11', false],
    ['Thu 01/12', false],
    ['Fri 02/12', false],
    ['Sat 03/12', false],
    ['Sun 04/12', false],
    ['Mon 05/12', false],
];

function setAvailableDays(days, setDays, daysAvailable) {
    const availableDays = days.map((day) => {
        return daysAvailable.includes(day[0]) ? [day[0], true] : [day[0], false];
    });
    setDays(availableDays);
}

export function Calendar(props) {
    const [days, setDays] = useState(calendarDaysList);
    const calendarDays = days.map((day) => {
        const [dayStr, dateStr] = day[0].split(' ');
        return <CalendarDay day={dayStr} date={dateStr} key={dateStr} isAvailable={day[1]} />;
    });

    useEffect(() => {
        async function getDaysAvailable() {
            try {
                const response = await axios.get('http://localhost:9000/days');
                setAvailableDays(days, setDays, response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getDaysAvailable();
        // setAvailableDays(days, setDays, ['Mon 28/11', 'Wed 30/11']);
    }, []);

    // useEffect(() => {
    //     const testAvail = ['Mon 28/11', 'Wed 30/11']; // TODO: make this an API call
    //     const availableDays = days.map((day) => {
    //         return testAvail.includes(day[0]) ? [day[0], true] : [day[0], false];
    //     });
    //     setDays(availableDays);
    // }, []);

    return (
        <>
            <Navbar bg='light'>
                <Container>
                    <Navbar.Brand href='#home'>Balmoral House Post Collective</Navbar.Brand>
                    <Nav>
                        <Nav.Link href='#login'>Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className='justify-content-center'>
                <Row className='text-center'>{calendarDays}</Row>
            </Container>
        </>
    );
}
