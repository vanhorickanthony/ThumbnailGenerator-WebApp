/**
 * Import router.
 */
const router = require('express').Router();

/**
 * Import API endpoints.
 */
const healthRouter = require('./health/router');
/**
 * Add these endpoints to the router.
 */
router.use('/health', healthRouter);
/**
 * Export the API router.
 */
module.exports = router;
