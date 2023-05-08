const express = require('express');
const router = express.Router();
const { OfferedDate } = require('../models/OfferedDate');
const { RequestedDate } = require('../models/RequestedDate');
const { Message } = require('../models/Message');
const { authenticateUser, isVerified } = require('../authenticate');
const { getFormattedDateStr } = require('../utils/dates');

/**
 * Gets the offers for a query of user, start date, and end date
 */
router.get('/', [authenticateUser, isVerified], async function (req, res) {
    const { user, startDate, endDate } = req.query;

    const dates = await OfferedDate.findDates(user, startDate, endDate);
    res.send(dates);
});

/**
 * Returns offers from users for a given date.
 */
router.get('/:date', [authenticateUser, isVerified], async function (req, res) {
    const offer = await OfferedDate.find({ date: req.params.date }).populate('user');
    res.send(offer);
});

/**
 * Adds an offer to a date given a user
 */
router.put('/', [authenticateUser, isVerified], async function (req, res) {
    const data = { date: req.body.date, user: req.user._id };

    // Verify user does not already have offer on that day
    let offer = await OfferedDate.findOne(data);
    if (offer !== null) {
        return res.status(400).send({ message: 'already-offered' });
    }

    // Add offer to database
    try {
        offer = new OfferedDate(data);
        await offer.save();
        offer = await offer.populate('user');
        res.send(offer);
    } catch {
        return res.status(400).send({ message: 'cannot-add-offer' });
    }
});

/**
 * Removes offered date from database
 */
router.delete('/:dateId', [authenticateUser, isVerified], async function (req, res) {
    // Verify offer exists on that day

    let offer;
    try {
        offer = await OfferedDate.findById(req.params.dateId).populate('user');
    } catch {
        return res.status(400).send({ message: 'error-in-find-offer' });
    }

    // Check offer exists
    if (offer === null) {
        return res.status(400).send({ message: 'offer-doesnt-exist' });
    }

    // Ensure offer is owned by user
    if (!offer.user._id.equals(req.user._id)) {
        return res.status(401).send({ message: 'unauthorized' });
    }

    // Delete offer
    try {
        await offer.remove();
    } catch {
        return res.status(400).send({ message: 'cannot-remove-offer' });
    }

    // Delete requests associated with offer
    try {
        const dates = await RequestedDate.findDatesForOffer(offer);
        if (dates.length > 0) {
            const ids = dates.map((request) => request._id);
            await RequestedDate.deleteMany({ _id: { $in: ids } });
            // Send messages to users that had requests for this offer
            const dateStr = getFormattedDateStr(offer.date);
            const userMessages = dates.map((request) => {
                return {
                    to: request.user._id,
                    from: offer.user._id,
                    text: `Your request on ${dateStr} for Apartment ${offer.user.aptNum} has been cancelled`,
                    seen: false,
                };
            });
            await Message.insertMany(userMessages);
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: 'error-in-removing-requests' });
    }

    res.send(offer);
});

module.exports = router;
