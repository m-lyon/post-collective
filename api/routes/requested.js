const express = require('express');
const router = express.Router();
const { RequestedDate } = require('../models/RequestedDate');
const { OfferedDate } = require('../models/OfferedDate');
const { verifyUser } = require('../authenticate');
const { Message } = require('../models/Message');
const { getFormattedDateStr } = require('../utils/dates');

router.get('/', verifyUser, async function (req, res, next) {
    const { startDate, endDate, offeredDateId } = req.query;
    let dates;

    try {
        if (offeredDateId !== undefined) {
            const { status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId);
            // Check offer exists
            if (!status) {
                res.status(400).send({ message: msg });
                return;
            }
            // Check that offer belongs to user
            if (!req.user._id.equals(offeredDate.user._id)) {
                res.status(401).send({ message: 'unauthorized' });
                return;
            }
            dates = await RequestedDate.findDatesForOffer(offeredDateId);
        } else {
            dates = await RequestedDate.findDates(req.user._id, startDate, endDate);
        }
        res.send(dates);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/**
 * Adds a request for an offered date
 */
router.put('/:date', verifyUser, async function (req, res) {
    const date = req.params.date;
    let { offeredDateId } = req.body;

    // Check date offered exists
    const { status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId);
    if (!status) {
        res.status(400).send({ message: msg });
        return;
    }

    // Validate that offeredDate and requestedDate have same date
    if (offeredDate.date !== date) {
        res.status(400).send({ message: 'dates-mismatch' });
        return;
    }

    // Validate that offeredDate and requestedDate are from different users.
    if (offeredDate.user._id === req.user._id) {
        res.status(400).send({ message: 'same-user-for-offer-and-request' });
    }

    const data = { date, user: req.user._id, offeredDate: offeredDateId };

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
        request = await request.populate('user', '_id aptNum');
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: 'cannot-add-request' });
        return;
    }

    // Send message to offer holder
    try {
        const dateStr = getFormattedDateStr(request.date);
        const msgData = {
            to: offeredDate.user._id,
            from: request.user._id,
            text: `Apartment ${request.user.aptNum} has requested a drop-off to your apartment on ${dateStr}`,
            seen: false,
        };
        const msg = new Message(msgData);
        await msg.save();
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: 'error-in-sending-notification' });
    }

    res.send(request);
});

/**
 * Removes requested date from database
 */
router.delete('/:dateId', verifyUser, async function (req, res) {
    // Verify request exists on that day
    let request;
    try {
        request = await RequestedDate.findById(req.params.dateId).populate('offeredDate');
    } catch {
        res.status(500).send({ message: 'error-in-find-request' });
        return;
    }

    if (request === null) {
        res.status(400).send({ message: 'request-doesnt-exist' });
        return;
    }

    // Ensure request belongs to user
    if (!req.user._id.equals(request.user._id)) {
        res.status(401).send({ message: 'unauthorized' });
        return;
    }

    // Delete request
    try {
        await request.remove();
    } catch {
        res.status(500).send({ message: 'error-in-remove-request' });
        return;
    }

    // Add delete notification to offer holder,
    // or remove unread request notification
    try {
        const msg = await Message.findOne({ to: request.offeredDate.user._id });
        if (msg === null) {
            console.log('message not found, this shouldnt happen');
            console.log('request.offeredDate._id: ', request.offeredDate._id);
        } else {
            if (msg.seen) {
                // Send delete notification if read
                const dateStr = getFormattedDateStr(request.date);
                const msgData = {
                    to: request.offeredDate.user._id,
                    from: request.user._id,
                    text: `Apartment ${request.user.aptNum} has removed their drop-off request for ${dateStr}`,
                    seen: false,
                };
                const newMsg = new Message(msgData);
                await newMsg.save();
            } else {
                // Remove message if unread
                await msg.remove();
            }
        }
    } catch (err) {
        res.status(500).send({ message: 'error-in-sending-notification' });
        return;
    }
    res.send(request);
});

module.exports = router;
