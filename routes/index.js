/**
 * Import router.
 */
const router = require('express').Router();

/**
 * Import regular & API router.
 */
const baseRouter = require('./base');
const apiRouter = require('../api/index');

/**
 * Add these to the main router.
 */
router.use('/api', apiRouter);
router.use('/', baseRouter);

/**
 * Export the main router.
 */
module.exports = router;
