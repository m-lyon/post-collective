const passport = require('passport');
const jwt = require('jsonwebtoken');
const dev = process.env.NODE_ENV === 'development';

exports.COOKIE_OPTIONS = {
    httpOnly: true,
    // Since localhost does not use https protocol,
    // secure cookies do not work correctly (in postman)
    secure: !dev,
    signed: true,
    maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
    sameSite: dev ? 'lax' : 'none',
};

exports.getToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRY),
    });
};

exports.getRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
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
