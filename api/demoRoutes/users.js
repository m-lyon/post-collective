const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models/User');
const { getToken, COOKIE_OPTIONS } = require('../authenticate');
const { getRefreshToken } = require('../authenticate');
const { generateRandomString, generateRandomUsername } = require('../utils/rng');

function createDummyUser(res) {
    const userDetails = {
        username: generateRandomUsername(),
        name: 'Patrick',
        aptNum: '1',
        isVerified: true,
        verificationCode: generateRandomString(),
    };
    console.log(userDetails);
    User.register(new User(userDetails), 'test', (err, user) => {
        if (err) {
            try {
                if (err.code === 11000 && Object.hasOwn(err.keyValue, 'aptNum')) {
                    console.log('Apt num already in use');
                    return res.status(409).send({ message: 'apt-num-already-in-use' });
                } else if (err.name === 'UserExistsError') {
                    console.log('User already exists');
                    return res.status(409).send({ message: 'user-already-exists' });
                } else if (err.name === 'ValidationError' && err.errors.aptNum) {
                    console.log('Invalid apt num');
                    return res.status(409).send({ message: 'invalid-apt-num' });
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
                console.log('error in saving user: ', err);
                return res.status(500).send(err);
            }
            res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token, user });
        });
    });
}

router.post('/refreshToken', (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (!refreshToken) {
        console.log('Creating dummy user');
        return createDummyUser(res);
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
                        console.log('error in saving user: ', err);
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

module.exports = router;
