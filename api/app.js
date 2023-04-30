const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

if (process.env.NODE_ENV !== 'production') {
    // Load environment variables from .env file in non prod environments
    require('dotenv').config();
}

require('./utils/connectdb');
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const offeredRouter = require('./routes/offered');
const requestRouter = require('./routes/requested');
const messageRouter = require('./routes/notify');
const resetPasswordRouter = require('./routes/resetPassword');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : [];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json()); // parses JSON requests
app.use(express.urlencoded({ extended: false })); // parses url-encoded form requests
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/offered', offeredRouter);
app.use('/requested', requestRouter);
app.use('/notify', messageRouter);
app.use('/resetPassword', resetPasswordRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
