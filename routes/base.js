/**
 * The base router sends all regular traffic (non-API traffic) to the frontend, which is build to public.
 */
const router = require('express').Router();
const path = require('path');

router.get(
    '**',
    function(req, res, next)
    {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

/**
 * Export the base router.
 */
module.exports = router;
