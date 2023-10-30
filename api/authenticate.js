const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
    DEV,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    JWT_SECRET,
    SESSION_EXPIRY,
} = require('./constants');

exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: !DEV,
    signed: true,
    maxAge: eval(REFRESH_TOKEN_EXPIRY) * 1000,
    sameSite: DEV ? 'lax' : 'none',
};

exports.getToken = (user) => {
    return jwt.sign(user, JWT_SECRET, {
        expiresIn: eval(SESSION_EXPIRY),
    });
};

exports.getRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
        expiresIn: eval(REFRESH_TOKEN_EXPIRY),
    });
    return refreshToken;
};

exports.authenticateUser = passport.authenticate('jwt', { session: false });

exports.isVerified = function (req, res, next) {
    if (!req.user.isVerified) {
        return res.status(401).send('User needs verification');
    }
    next();
};
