const express = require('express');
const router = express.Router();

function getDateRange(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = [];
    for (let i = 0; i < numDays; i++) {
        const day = new Date(startDate);
        day.setDate(day.getDate() + i);
        days.push(day);
    }
    return days;
}

function getRandomAvailibility(dateRange) {
    const possibleDays = dateRange.map((day) => {
        return day.toISOString().slice(0, 10);
    });
    const n = Math.ceil(Math.random() * possibleDays.length);
    const randomDays = possibleDays.sort(() => 0.5 - Math.random()).slice(0, n);
    return randomDays;
}

function parseDate(dateStr) {
    // YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');

    // month is 0-based, that's why we need dataParts[1] - 1
    const dateObj = new Date(year, month - 1, day);
    return dateObj;
}

router.get('/', function (req, res) {
    const startDate = parseDate(req.query.startDate);
    const endDate = parseDate(req.query.endDate);
    const dateRange = getDateRange(startDate, endDate);
    const availibility = getRandomAvailibility(dateRange);
    res.send(availibility);
});

module.exports = router;
