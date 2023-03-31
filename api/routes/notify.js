const express = require('express');
const router = express.Router();
const { Message } = require('../models/Message');

router.get('/to/:userId', async function (req, res) {
    const start = parseInt(req.query.start);
    const length = parseInt(req.query.length);
    let messages, hasMore;
    try {
        messages = await Message.find({ to: req.params.userId })
            .sort({ createdAt: 'desc' })
            .skip(start)
            .limit(length)
            .exec();
        const count = await Message.find({ to: req.params.userId }).countDocuments();
        res.send({ messages: messages, hasMore: count > length });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'error-in-find-messages' });
        return;
    }
});

router.patch('/:msgId', async function (req, res) {
    const { status, msg } = await Message.checkExists(req.params.msgId);
    if (!status) {
        res.status(400).send({ message: msg });
        return;
    }
    const msgAttributes = ['to', 'from', 'text', 'seen'];
    for (const key in req.body) {
        if (!msgAttributes.includes(key)) {
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
