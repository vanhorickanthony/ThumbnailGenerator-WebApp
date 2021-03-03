/**
 * Include required packages.
 */
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const logger = require('morgan');
const cors = require('cors');

/**
 * Include modules etc
 */
const routes = require('./routes/index');

const app = express();

/**
 * Configure application settings etc.
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/**
 * Make the server use the main router.
 */
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.message = err.message;
    res.error = err;

    // return error
    res.status(err.status);
    res.status(err.status).json(
        {
            message: err.message,
            error: err,
        });
});

module.exports = app;
