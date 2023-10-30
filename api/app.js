const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

// Load env variables
require('dotenv').config();
const { WHITELISTED_DOMAINS, DEMO, COOKIE_SECRET } = require('./constants');

require('./utils/connectdb');
require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const indexRouter = require('./routes/index');
const detailsRouter = require('./routes/details');
const offeredRouter = require('./routes/offered');
const requestRouter = require('./routes/requested');
const messageRouter = require('./routes/notify');
const resetPasswordRouter = require('./routes/resetPassword');

let usersRouter;
if (DEMO) {
    usersRouter = require('./demoRoutes/users');
} else {
    usersRouter = require('./routes/users');
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add the client URL to the CORS policy

const whitelist = WHITELISTED_DOMAINS ? WHITELISTED_DOMAINS.split(',') : [];
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

let routeName;
if (DEMO) {
    routeName = 'post-api-demo';
} else {
    routeName = 'post-api';
}
console.log('Route name: ', routeName);

app.use(cookieParser(COOKIE_SECRET));
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json()); // parses JSON requests
app.use(express.urlencoded({ extended: false })); // parses url-encoded form requests
app.use(`/${routeName}-public`, express.static(path.join(__dirname, 'public')));
app.use(`/${routeName}`, indexRouter);
app.use(`/${routeName}/details`, detailsRouter);
app.use(`/${routeName}/users`, usersRouter);
app.use(`/${routeName}/offered`, offeredRouter);
app.use(`/${routeName}/requested`, requestRouter);
app.use(`/${routeName}/notify`, messageRouter);
app.use(`/${routeName}/resetPassword`, resetPasswordRouter);

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
