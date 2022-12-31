const express = require('express');
const router = express.Router();
const { User, RequestedDate, OfferedDate } = require('../models');

// function getDateRange(startDate, endDate) {
//     const diffTime = Math.abs(endDate - startDate);
//     const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     const days = [];
//     for (let i = 0; i < numDays; i++) {
//         const day = new Date(startDate);
//         day.setDate(day.getDate() + i);
//         days.push(day);
//     }
//     return days;
// }

// function getRandomAvailability(dateRange) {
//     const possibleDays = dateRange.map((day) => {
//         return day.toISOString().slice(0, 10);
//     });
//     const n = Math.ceil(Math.random() * possibleDays.length);
//     const randomDays = possibleDays.sort(() => 0.5 - Math.random()).slice(0, n);
//     return randomDays;
// }

function parseDate(dateStr) {
    // YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');

    // month is 0-based, that's why we need dataParts[1] - 1
    const dateObj = new Date(year, month - 1, day);
    return dateObj;
}

// function parseDateRange(startDateStr, endDateStr) {
//     const startDate = parseDate(startDateStr);
//     const endDate = parseDate(endDateStr);
//     return getDateRange(startDate, endDate);
// }

async function getOffersForUser(name, startDate, endDate) {
    const user = await User.findOne({ name: name });
    if (user === null) {
        return []; // User not found
    }
    console.log(user);
    const offers = await OfferedDate.findDateRangeForUser(
        user._id,
        parseDate(startDate),
        parseDate(endDate)
    );
    return offers.map((offer) => ({
        date: offer.date.toISOString().slice(0, 10),
        aptNum: offer.aptNum,
    }));
    const days = await OfferedDate.findDateRangeForUser(user._id, startDate, endDate);
    // TODO: use DateFormat method when can figure out export syntax
    return days.map((day) => new Date(day).toISOString().slice(0, 10));
}

router.get('/', async function (req, res) {
    // TODO: this route should eventually return all available days
    // then, can additionally filter based on date range
    if (Object.keys(req.query).length === 0) {
        res.send('This route will eventually send all availability for a given user');
        return;
    }
    const { user, startDate, endDate } = req.query;

    // TODO: should change filtering to work if only startDate or endDate is provided
    // TODO: use DateFormat method when can figure out export syntax
    const offers = await getOffersForUser(user, startDate, endDate);

    res.send(offers);
});

router.get('/:day', function (req, res) {
    // TODO
    res.send(`This route will return the availability for the day: ${req.params.day}`);
});

router.put('/:day', async function (req, res) {
    // try {
    // TODO: make database call
    // }
    res.send(`This route will set a user as availabile for the day: ${req.params.day}`);
});

router.delete('/:day', function (req, res) {
    // TODO
    res.send(`This route will remove a user as available for the day: ${req.params.day}`);
});

module.exports = router;
