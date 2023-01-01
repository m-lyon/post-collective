const express = require('express');
const router = express.Router();
const parseDate = require('../date_utils');
const { OfferedDate, getDatesForUser } = require('../models');
const { checkUserExists } = require('./utils');

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
    const offers = await getDatesForUser(OfferedDate, user, startDate, endDate);

    res.send(offers);
});

/**
 * Returns offers from users for a given date.
 */
router.get('/:date', async function (req, res) {
    const date = parseDate(req.params.date);
    const offer = await OfferedDate.find({ date: date }).populate('user');
    res.send(offer);
});

/**
 * Adds an offer to a date given a user
 */
router.put('/:date', async function (req, res) {
    // Check user exists
    // TODO: this is giving 23:00:00 datetimes for some reason..
    const userExists = await checkUserExists(req, res);
    if (!userExists) {
        return;
    }
    const data = { date: parseDate(req.params.date), user: req.query.user };

    // Verify user does not already have offer on that day
    let offer = await OfferedDate.findOne(data);
    if (offer !== null) {
        res.status(400).send({ status: 400, error: 'already-offered' });
        return;
    }

    // Add offer to database
    try {
        offer = new OfferedDate(data);
        await offer.save(); // do rejects from a promise throw an exception?
        res.send();
    } catch {
        res.status(400).send({ status: 400, error: 'cannot-add-offer' });
        return;
    }
});

/**
 * Removes offered date from database
 */
router.delete('/:date', async function (req, res) {
    const userExists = await checkUserExists(req, res);
    if (!userExists) {
        return;
    }
    const data = { date: parseDate(req.params.date), user: req.query.user };

    // Verify offer exists on that day
    let offer = await OfferedDate.findOne(data);
    if (offer === null) {
        res.status(400).send({ status: 400, error: 'offer-doesnt-exist' });
        return;
    }

    // Delete offer
    try {
        await offer.remove();
        res.send();
    } catch {
        res.status(400).send({ status: 400, error: 'cannot-remove-offer' });
        return;
    }
});

module.exports = router;
