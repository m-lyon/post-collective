const express = require('express');
const router = express.Router();
const parseDate = require('../date_utils');
const { User } = require('../models/User');
const { OfferedDate } = require('../models/OfferedDate');
const { RequestedDate } = require('../models/RequestedDate');
const { Message } = require('../models/Message');
const { verifyUser } = require('../authenticate');

/**
 * Gets the offers for a query of user, start date, and end date
 */
router.get('/', verifyUser, async function (req, res) {
    const { user, startDate, endDate } = req.query;

    const dates = await OfferedDate.findDates(user, parseDate(startDate), parseDate(endDate));
    console.log(dates);
    res.send(dates);
});

/**
 * Returns offers from users for a given date.
 */
router.get('/:date', verifyUser, async function (req, res) {
    const date = parseDate(req.params.date);
    const offer = await OfferedDate.find({ date: date }).populate('user');
    res.send(offer);
});

/**
 * Adds an offer to a date given a user
 */
router.put('/:date', verifyUser, async function (req, res) {
    // Check user exists
    // TODO: this is giving 23:00:00 datetimes for some reason..

    const data = { date: parseDate(req.params.date), user: req.user._id };

    // Verify user does not already have offer on that day
    let offer = await OfferedDate.findOne(data);
    if (offer !== null) {
        res.status(400).send({ message: 'already-offered' });
        return;
    }

    // Add offer to database
    try {
        offer = new OfferedDate(data);
        await offer.save();
        offer = await offer.populate('user');
        res.send(offer);
    } catch {
        res.status(400).send({ message: 'cannot-add-offer' });
        return;
    }
});

function getDayMonthStr(date) {
    const [month, day] = date.toISOString().slice(5, 10).split('-');
    return `${day}/${month}`;
}

/**
 * Removes offered date from database
 */
router.delete('/:dateId', verifyUser, async function (req, res) {
    // Verify offer exists on that day
    let offer;
    try {
        offer = await OfferedDate.findById(req.params.dateId).populate('user');
    } catch {
        res.status(400).send({ message: 'error-in-find-offer' });
        return;
    }

    if (offer === null) {
        res.status(400).send({ message: 'offer-doesnt-exist' });
        return;
    }

    if (offer.user._id !== req.user._id) {
        res.status(401).send({ message: 'unauthorized' });
        return;
    }

    // Delete offer
    try {
        await offer.remove();
    } catch {
        res.status(400).send({ message: 'cannot-remove-offer' });
        return;
    }

    // Delete requests associated with offer
    try {
        const dates = await RequestedDate.findDatesForOffer(offer);
        if (dates.length > 0) {
            const ids = dates.map((request) => request._id);
            const dateStr = getDayMonthStr(offer.date);
            const userMessages = dates.map((request) => {
                return {
                    to: request.user._id,
                    from: offer.user._id,
                    text: `Your request on ${dateStr} for Apartment ${offer.user.aptNum} has been cancelled`,
                    seen: false,
                };
            });
            await RequestedDate.deleteMany({ _id: { $in: ids } });
            await Message.insertMany(userMessages);
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).send({ message: 'error-in-removing-requests', err: err });
        return;
    }

    res.send(offer);
});

module.exports = router;
