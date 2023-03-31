const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models/User');
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require('../authenticate');

router.post('/signup', (req, res) => {
    // Ensure fields are present
    for (let attr of ['name', 'username', 'password', 'aptNum']) {
        if (req.body[attr] === undefined) {
            res.status(400).send({ message: `${attr}-not-provided` });
            return;
        }
    }
    const { username, name, aptNum, password } = req.body;
    const userDetails = { username, name, aptNum };
    User.register(new User(userDetails), password, (err, user) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
        const token = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });
        user.refreshToken.push({ refreshToken });
        user.save((err, user) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token });
        });
    });
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    const token = getToken({ _id: req.user._id });
    const refreshToken = getRefreshToken({ _id: req.user._id });
    User.findById(req.user._id).then(
        (user) => {
            user.refreshToken.push({ refreshToken });
            user.save((err, user) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
                    res.send({ success: true, token });
                }
            });
        },
        (err) => next(err)
    );
});

router.post('/refreshToken', (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (!refreshToken) {
        res.status(401).send('Unauthorized.');
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = payload._id;
        User.findOne({ _id: userId }).then(
            (user) => {
                if (!user) {
                    res.status(401).send('Unauthorized.');
                    return;
                }
                // Find the refresh token against the user record in database
                const tokenIndex = user.refreshToken.findIndex(
                    (item) => item.refreshToken === refreshToken
                );

                if (tokenIndex === -1) {
                    res.status(401).send('Unauthorized.');
                    return;
                }
                const token = getToken({ _id: userId });
                // If the refresh token exists, then create new one and replace it.
                const newRefreshToken = getRefreshToken({ _id: userId });
                user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
                user.save((err, user) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
                        res.send({ success: true, token });
                    }
                });
            },
            (err) => next(err)
        );
    } catch (err) {
        res.status(401).send('Unauthorized.');
    }
});

router.get('/me', verifyUser, (req, res) => {
    res.send(req.user);
});

router.get('/logout', verifyUser, (req, res, next) => {
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

            user.save((err, user) => {
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
