const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config({ path: './.env' });
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');

const AppError = require('./util/appError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const mobileRouter = require('./routers/mobileRouter');
const userRouter = require('./routers/userRouter');
const viewRouter = require('./routers/viewRouter');
const paymentRouter = require('./routers/paymentRouter');
const reviewRouter = require('./routers/reviewRouter');

const globalError = require('./controllers/errorController');

// Middleware global

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers,  XSS
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Brute Forte Attacks . Limit requests from the same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //maximum 100 requests per windowMs
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // de doc file json
// app.use(express.urlencoded({ extended: true, limit: '10kb' })); // built-in with Express starting from version 4.16.0.
app.use(cookieParser());

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// axios
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdnjs.cloudflare.com"
  );
  next();
});

// ROUTER
app.use('/', viewRouter);
app.use('/api/v0/mobiles', mobileRouter);
app.use('/api/v0/users', userRouter);
app.use('/api/v0/reviews', reviewRouter);
app.use('/api/v0/payments', paymentRouter);

// Middleware handle global error
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on the server`, 404));
});

app.use(globalError);

module.exports = app;
