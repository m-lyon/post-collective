const express = require('express');
const router = express.Router();

const { Message } = require('../models/Message');

router.get('/to/:userId', async function (req, res) {
    let messages;
    try {
        messages = await Message.find({ to: req.params.userId });
        res.send(messages);
    } catch {
        res.status(400).send({ status: 400, error: 'error-in-find-messages' });
        return;
    }
});

module.exports = router;
