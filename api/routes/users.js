const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const router = express.Router();
const { User } = require('../models/User');
const { getToken, COOKIE_OPTIONS } = require('../authenticate');
const { getRefreshToken, authenticateUser } = require('../authenticate');
const { generateRandomString } = require('../utils/rng');
const { sendRegistrationEmail } = require('../utils/email');

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().email().required(),
        password: Joi.string().required(),
        aptNum: Joi.number().integer().required(),
    });
    return schema.validate(user);
}

router.post('/signup', (req, res) => {
    // Ensure fields are present
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const { username, name, aptNum, password } = req.body;
    const userDetails = {
        username,
        name,
        aptNum,
        isVerified: false,
        verificationCode: generateRandomString(),
    };
    User.register(new User(userDetails), password, (err, user) => {
        if (err) {
            try {
                if (err.code === 11000 && Object.hasOwn(err.keyValue, 'aptNum')) {
                    return res.status(409).send({ message: 'apt-num-already-in-use' });
                } else if (err.name === 'UserExistsError') {
                    return res.status(409).send({ message: 'user-already-exists' });
                } else {
                    console.log('Unexpected error in register user: ', err);
                    return res.status(400).send('Unknown error');
                }
            } catch {
                console.log('This error shouldnt happen: ', err);
                return res.status(500).send('Unknown error');
            }
        }
        const token = getToken({ _id: user._id, isVerified: user.isVerified });
        const refreshToken = getRefreshToken({ _id: user._id });
        user.refreshToken.push({ refreshToken });
        user.save((err, user) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token, user });
            // Send notification email to admin
            try {
                sendRegistrationEmail(user);
            } catch (err) {
                console.log('Error in sending email: ', err);
            }
        });
    });
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res, next) => {
    const token = getToken({ _id: req.user._id, isVerified: req.user.isVerified });
    const refreshToken = getRefreshToken({ _id: req.user._id });
    User.findById(req.user._id).then(
        (user) => {
            user.refreshToken.push({ refreshToken });
            user.save((err, user) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
                    res.send({ success: true, token, user });
                }
            });
        },
        (err) => {
            next(err);
        }
    );
});

router.post('/refreshToken', (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (!refreshToken) {
        return res.status(401).send('Unauthorized.');
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = payload._id;
        User.findOne({ _id: userId }).then(
            (user) => {
                if (!user) {
                    return res.status(401).send('Unauthorized.');
                }
                // Find the refresh token against the user record in database
                const tokenIndex = user.refreshToken.findIndex(
                    (item) => item.refreshToken === refreshToken
                );

                if (tokenIndex === -1) {
                    return res.status(401).send('Unauthorized.');
                }
                const token = getToken({ _id: userId, isVerified: user.isVerified });
                // If the refresh token exists, then create new one and replace it.
                const newRefreshToken = getRefreshToken({ _id: userId });
                user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
                user.save((err, user) => {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
                        return res.send({ success: true, token, user });
                    }
                });
            },
            (err) => next(err)
        );
    } catch (err) {
        return res.status(401).send('Unauthorized.');
    }
});

router.post('/verify', authenticateUser, async function (req, res, user) {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send({ message: 'no-code-provided' });
    }

    if (req.user.isVerified) {
        return res.status(400).send({ message: 'user-already-verified' });
    }

    if (!req.user.verificationCode) {
        return res.status(400).send({ message: 'no-code-available' });
    }

    if (code === req.user.verificationCode) {
        req.user.isVerified = true;
        req.user.verificationCode = undefined;
        try {
            await req.user.save();
            return res.status(200).send({ message: 'Success', user: req.user });
        } catch (err) {
            next(err);
        }
    } else {
        return res.status(401).send('Unauthorized.');
    }
});

router.get('/me', authenticateUser, (req, res) => {
    res.send(req.user);
});

router.get('/logout', authenticateUser, (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;
    User.findById(req.user._id).then(
        (user) => {
            const tokenIndex = user.refreshToken.findIndex(
                (item) => item.refreshToken === refreshToken
            );

            if (tokenIndex !== -1) {
                user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
            }

            user.save((err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.clearCookie('refreshToken', COOKIE_OPTIONS);
                    res.send({ success: true });
                }
            });
        },
        (err) => next(err)
    );
});

module.exports = router;
