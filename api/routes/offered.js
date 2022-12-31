const express = require('express');
const router = express.Router();
const { User, RequestedDate, OfferedDate } = require('../models');

function parseDate(dateStr) {
    // YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');

    // month is 0-based, that's why we need dataParts[1] - 1
    const date = new Date(year, month - 1, day);
    return date;
}

async function getOffersForUser(name, startDate, endDate) {
    const user = await User.findOne({ name: name });
    if (user === null) {
        return []; // User not found
    }

    const offers = await OfferedDate.findDateRangeForUser(
        user._id,
        parseDate(startDate),
        parseDate(endDate)
    );
    return offers.map((offer) => ({
        date: offer.date.toISOString().slice(0, 10),
        aptNum: offer.aptNum,
    }));
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
    let user;
    try {
        user = await User.findById(req.query.user);
    } catch (err) {
        res.status(400).send({ status: 400, error: 'user-not-found' });
        return;
    }
    const data = { date: parseDate(req.params.date), user: user._id };

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
    let user;
    try {
        user = await User.findById(req.query.user);
    } catch (err) {
        res.status(400).send({ status: 400, error: 'user-not-found' });
        return;
    }
    const data = { date: parseDate(req.params.date), user: user._id };

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
