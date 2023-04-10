const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');
const { verifyUser } = require('../authenticate');

router.get('/', verifyUser, async function (req, res) {
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
        res.status(400).send({ message: 'error-in-find-messages' });
        return;
    }
});

router.patch('/:msgId', verifyUser, async function (req, res) {
    // Check message exists
    const dbResponse = await Message.checkExists(req.params.msgId);
    if (!dbResponse.status) {
        res.status(400).send({ message: dbResponse.msg });
        return;
    }

    // Ensure user is recipient
    if (!req.user._id.equals(dbResponse.res.to._id)) {
        res.status(401).send({ message: 'not-owner-of-message' });
        return;
    }

    // Ensure only allowed attributes are sent
    for (const key in req.body) {
        if (!['text', 'seen'].includes(key)) {
            res.status(400).send({ status: 400, message: 'unrecognised-msg-attr' });
            return;
        }
    }

    try {
        const msg = await Message.findByIdAndUpdate(req.params.msgId, req.body);
        res.send(msg);
    } catch {
        res.status(400).send({ message: 'cannot-update-message' });
        return;
    }
});

module.exports = router;
