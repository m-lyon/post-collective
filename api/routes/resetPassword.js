const express = require('express');
const crypto = require('crypto');
const Joi = require('joi');
const { User } = require('../models/User');
const { ResetToken } = require('../models/ResetToken');
const sendEmail = require('../utils/email');
const router = express.Router();

router.get('/:userId/:token', async (req, res) => {
    try {
        // Validate user and token
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(401).send('Invalid link or expired.');

        const token = await ResetToken.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(401).send('Invalid link or expired.');

        res.render('reset-form', { userId: user._id, token });
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occured.');
    }
});

router.post('/', async (req, res) => {
    try {
        const schema = Joi.object({ username: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send({ message: 'user-not-found' });

        let token = await ResetToken.findOne({ userId: user._id });
        if (!token) {
            token = await new ResetToken({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            }).save();
        }

        await sendEmail(user, token.token);
        res.send('Success');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/:userId/:token', async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(500).send(error.details[0].message);

        // Validate user and token
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(401).send('Invalid link or expired.');

        const token = await ResetToken.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(401).send('Invalid link or expired.');

        await user.setPassword(req.body.password);
        await user.save();
        await token.delete();
        res.send('Password reset sucessfully, you can close this window.');
    } catch (error) {
        res.status(500).send('An error occured.');
        console.log(error);
    }
});

module.exports = router;
