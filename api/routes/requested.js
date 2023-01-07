const express = require('express');
const router = express.Router();
const parseDate = require('../date_utils');
const { User } = require('../models/User');
const { RequestedDate } = require('../models/RequestedDate');
const { OfferedDate } = require('../models/OfferedDate');
const { request } = require('express');

router.get('/', async function (req, res) {
    const { user, startDate, endDate } = req.query;
    const { status, msg } = await User.checkExists(user);
    if (!status && msg !== 'user-id-not-provided') {
        res.status(400).send({ status: 400, error: msg });
        return;
    }
    const dates = await RequestedDate.findDates(user, parseDate(startDate), parseDate(endDate));
    console.log(dates);
    res.send(dates);
});

/**
 * Returns offers from users for a given date.
 */
router.get('/:date', async function (req, res) {
    const date = parseDate(req.params.date);
    const offer = await RequestedDate.find({ date: date }).populate('user date');
    res.send(offer);
});

/**
 * Adds an offer to a date given a user
 */
router.put('/:date', async function (req, res) {
    const date = req.params.date;
    let { user, offeredDateId } = req.body;
    console.log(date, user, offeredDateId);

    // Check user exists
    let { status, msg } = await User.checkExists(user);
    if (!status) {
        res.status(400).send({ status: 400, error: msg });
        return;
    }

    // Check date offered exists
    let offeredDate;
    ({ status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId));
    if (!status) {
        res.status(400).send({ status: 400, error: msg });
        return;
    }

    // Validate that offeredDate and requestedDate have same date
    if (offeredDate.toDateString() !== parseDate(date).toDateString()) {
        res.status(400).send({ status: 400, error: 'dates-mismatch' });
        return;
    }

    // TODO: Validate that offeredDate and requestedDate are from different users.

    const data = { date: parseDate(date), user: user, offeredDate: offeredDateId };

    // Verify user does not already have offer on that day
    let offer = await RequestedDate.findOne(data);
    if (offer !== null) {
        res.status(400).send({ status: 400, error: 'already-requested' });
        return;
    }

    // Add request to database
    try {
        let request = new RequestedDate(data);
        await request.save();
        request = await request.populate('user');
        res.send(request);
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ status: 400, error: 'cannot-add-request' });
        return;
    }
});

/**
 * Removes offered date from database
 */
router.delete('/:date', async function (req, res) {
    const userExists = await User.checkExists(req, res);
    if (!userExists) {
        return;
    }
    const data = { date: parseDate(req.params.date), user: req.query.user };

    // Verify offer exists on that day
    let request = await RequestedDate.findOne(data);
    if (request === null) {
        res.status(400).send({ status: 400, error: 'request-doesnt-exist' });
        return;
    }

    // Delete offer
    try {
        await request.remove();
        res.send();
    } catch {
        res.status(400).send({ status: 400, error: 'cannot-remove-offer' });
        return;
    }
});

module.exports = router;
