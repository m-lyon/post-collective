const express = require('express');
const router = express.Router();
const parseDate = require('../date_utils');
const { User } = require('../models/User');
const { RequestedDate } = require('../models/RequestedDate');
const { OfferedDate } = require('../models/OfferedDate');

router.get('/', async function (req, res) {
    const { user, startDate, endDate } = req.query;

    // TODO: use DateFormat method when can figure out export syntax
    const offers = await getDates(RequestedDate, user, startDate, endDate);

    res.send(offers);
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
    let { user, offeredDateId } = req.query;
    // Check user exists
    let { status, msg } = await User.checkExists(req.query.user);
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
    if (offeredDate.toDateString() !== parseDate(req.params.date).toDateString()) {
        res.status(400).send({ status: 400, error: 'dates-mismatch' });
        return;
    }

    const data = { date: parseDate(req.params.date), user: user, offeredDate: offeredDateId };

    // Verify user does not already have offer on that day
    let offer = await RequestedDate.findOne(data);
    if (offer !== null) {
        res.status(400).send({ status: 400, error: 'already-requested' });
        return;
    }

    // Add request to database
    try {
        request = new RequestedDate(data);
        await request.save(); // do rejects from a promise throw an exception?
        res.send();
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
