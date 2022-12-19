const express = require('express');
const router = express.Router();

function getInitialDates(numDays = 7) {
    const days = [];
    for (let i = 0; i < numDays; i++) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + i);
        days.push({ date: nextDay, isAvailable: false });
    }
    return days;
}

router.get('/', function (req, res, next) {
    const possibleDays = getInitialDates().map((day) => {
        return day.date.toISOString().slice(0, 10);
    });
    const n = Math.ceil(Math.random() * possibleDays.length);
    const randomDays = possibleDays.sort(() => 0.5 - Math.random()).slice(0, n);
    res.send(randomDays);
});

module.exports = router;
