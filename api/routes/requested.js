const express = require('express');
const router = express.Router();
const parseDate = require('../date_utils');
const { User, RequestedDate, OfferedDate, getDatesForUser } = require('../models');

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
    const offers = await getDatesForUser(RequestedDate, user, startDate, endDate);

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
    const { userId, offeredDateId } = req.query;
    // Check user exists
    try {
        await User.findById(userId);
    } catch (err) {
        res.status(400).send({ status: 400, error: 'user-not-found' });
        return;
    }

    // Check date offered exists
    try {
        await OfferedDate.findById(offeredDateId);
    } catch (err) {
        res.status(400).send({ status: 400, error: 'offered-date-not-found' });
        return;
    }
    const data = { date: parseDate(req.params.date), user: userId, date: offeredDateId };

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
    } catch {
        res.status(400).send({ status: 400, error: 'cannot-add-request' });
        return;
    }
});

/**
 * Removes offered date from database
 */
router.delete('/:date', async function (req, res) {
    let user;
    try {
        user = await User.findById(req.query.user);
    } catch (err) {
        res.status(400).send({ status: 400, error: 'user-not-found' });
        return;
    }
    const data = { date: parseDate(req.params.date), user: user._id };

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
