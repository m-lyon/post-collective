const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    const possibleDays = [
        'Mon 28/11',
        'Tue 29/11',
        'Wed 30/11',
        'Thu 01/12',
        'Fri 02/12',
        'Sat 03/12',
        'Sun 04/12',
        'Mon 05/12',
    ];
    const n = Math.ceil(Math.random() * possibleDays.length);
    const randomDays = possibleDays.sort(() => 0.5 - Math.random()).slice(0, n);
    res.send(randomDays);
});

module.exports = router;
