const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');
const { authenticateUser, isVerified } = require('../authenticate');

router.get('/', [authenticateUser, isVerified], async function (req, res) {
    const start = parseInt(req.query.start);
    const length = parseInt(req.query.length);

    let messages;
    try {
        messages = await Message.find({ to: req.user._id })
            .sort({ createdAt: 'desc' })
            .skip(start)
            .limit(length)
            .exec();
        const count = await Message.find({ to: req.user._id }).countDocuments();
        res.send({ messages: messages, hasMore: count > length });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: 'error-in-find-messages' });
    }
});

router.patch('/:msgId', [authenticateUser, isVerified], async function (req, res) {
    // Check message exists
    const dbResponse = await Message.checkExists(req.params.msgId);
    if (!dbResponse.status) {
        return res.status(400).send({ message: dbResponse.msg });
    }

    // Ensure user is recipient
    if (!req.user._id.equals(dbResponse.res.to._id)) {
        return res.status(401).send({ message: 'not-owner-of-message' });
    }

    // Ensure only allowed attributes are sent
    for (const key in req.body) {
        if (!['text', 'seen'].includes(key)) {
            return res.status(400).send({ status: 400, message: 'unrecognised-msg-attr' });
        }
    }

    try {
        const msg = await Message.findByIdAndUpdate(req.params.msgId, req.body);
        res.send(msg);
    } catch {
        return res.status(400).send({ message: 'cannot-update-message' });
    }
});

module.exports = router;
