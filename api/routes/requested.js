const express = require('express');
const router = express.Router();
const { RequestedDate } = require('../models/RequestedDate');
const { OfferedDate } = require('../models/OfferedDate');
const { authenticateUser, isVerified } = require('../authenticate');
const { Message } = require('../models/Message');
const { getFormattedDateStr } = require('../utils/dates');

router.get('/', [authenticateUser, isVerified], async function (req, res, next) {
    const { startDate, endDate, offeredDateId } = req.query;
    let dates;

    try {
        if (offeredDateId !== undefined) {
            const { status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId);
            // Check offer exists
            if (!status) {
                return res.status(400).send({ message: msg });
            }
            // Check that offer belongs to user
            if (!req.user._id.equals(offeredDate.user._id)) {
                return res.status(401).send('Unauthorized.');
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
router.put('/:date', [authenticateUser, isVerified], async function (req, res) {
    const date = req.params.date;
    let { offeredDateId } = req.body;

    // Check date offered exists
    const { status, msg, offeredDate } = await OfferedDate.checkExists(offeredDateId);
    if (!status) {
        return res.status(400).send({ message: msg });
    }

    // Validate that offeredDate and requestedDate have same date
    if (offeredDate.date !== date) {
        return res.status(400).send({ message: 'dates-mismatch' });
    }

    // Validate that offeredDate and requestedDate are from different users.
    if (offeredDate.user._id === req.user._id) {
        return res.status(400).send({ message: 'same-user-for-offer-and-request' });
    }

    const data = { date, user: req.user._id, offeredDate: offeredDateId };

    // Verify user does not already have offer on that day
    let request = await RequestedDate.findOne(data);
    if (request !== null) {
        return res.status(400).send({ message: 'already-requested' });
    }

    // Add request to database
    try {
        request = new RequestedDate(data);
        await request.save();
        request = await request.populate('offeredDate', 'user');
        // .populate('user', 'aptNum')
        // .execPopulate();
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: 'cannot-add-request' });
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
        return res.status(500).send({ message: 'error-in-sending-notification' });
    }

    res.send(request);
});

/**
 * Removes requested date from database
 */
router.delete('/:dateId', [authenticateUser, isVerified], async function (req, res) {
    // Verify request exists on that day
    let request;
    try {
        request = await RequestedDate.findById(req.params.dateId)
            .populate('offeredDate', 'user')
            .populate('user', 'aptNum');
    } catch {
        return res.status(500).send({ message: 'error-in-find-request' });
    }

    if (request === null) {
        return res.status(400).send({ message: 'request-doesnt-exist' });
    }

    // Ensure request belongs to user
    if (!req.user._id.equals(request.user._id)) {
        return res.status(401).send('Unauthorized.');
    }

    // Delete request
    try {
        await request.remove();
    } catch {
        return res.status(500).send({ message: 'error-in-remove-request' });
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
        return res.status(500).send({ message: 'error-in-sending-notification' });
    }
    res.send(request);
});

module.exports = router;
