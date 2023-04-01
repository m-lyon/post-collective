const express = require('express');
const router = express.Router();
const parseDate = require('../date_utils');
const { User } = require('../models/User');
const { RequestedDate } = require('../models/RequestedDate');
const { OfferedDate } = require('../models/OfferedDate');
const { verifyUser } = require('../authenticate');

router.get('/', verifyUser, async function (req, res) {
    const { startDate, endDate, offeredDateId } = req.query;

    let dates;
    if (offeredDateId !== undefined) {
        const { status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId);
        // Check offer exists
        if (!status) {
            res.status(400).send({ message: msg });
            return;
        }
        // Check that offer belongs to user
        if (req.user._id !== offeredDate.user._id) {
            res.status(401).send({ message: 'unauthorized' });
            return;
        }
        dates = await RequestedDate.findDatesForOffer(offeredDateId);
    } else {
        dates = await RequestedDate.findDates(
            req.user._id,
            parseDate(startDate),
            parseDate(endDate)
        );
    }
    console.log(dates);
    res.send(dates);
});

/**
 * Adds a request for an offered date
 */
router.put('/:date', verifyUser, async function (req, res) {
    const date = req.params.date;
    let { offeredDateId } = req.body;
    console.log(date, offeredDateId);

    // Check date offered exists
    const { status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId);
    if (!status) {
        res.status(400).send({ message: msg });
        return;
    }

    // Validate that offeredDate and requestedDate have same date
    if (offeredDate.toDateString() !== parseDate(date).toDateString()) {
        res.status(400).send({ message: 'dates-mismatch' });
        return;
    }

    // Validate that offeredDate and requestedDate are from different users.
    if (offeredDate.user._id === req.user._id) {
        res.status(400).send({ message: 'same-user-for-offer-and-request' });
    }

    const data = { date: parseDate(date), user: req.user._id, offeredDate: offeredDateId };

    // Verify user does not already have offer on that day
    let request = await RequestedDate.findOne(data);
    if (request !== null) {
        res.status(400).send({ message: 'already-requested' });
        return;
    }

    // Add request to database
    try {
        request = new RequestedDate(data);
        await request.save();
        request = await request.populate('user');
        res.send(request);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: 'cannot-add-request' });
        return;
    }
});

/**
 * Removes requested date from database
 */
router.delete('/:dateId', verifyUser, async function (req, res) {
    // Verify request exists on that day
    let request;
    try {
        request = await RequestedDate.findById(req.params.dateId);
    } catch {
        res.status(500).send({ message: 'error-in-find-request' });
        return;
    }

    if (request === null) {
        res.status(400).send({ message: 'request-doesnt-exist' });
        return;
    }

    // Ensure request belongs to user
    if (req.user._id !== request.user._id) {
        res.status(401).send({ message: 'unauthorized' });
        return;
    }

    // Delete request
    try {
        await request.remove();
        res.send(request);
    } catch {
        res.status(500).send({ message: 'error-in-remove-request' });
    }
});

module.exports = router;
