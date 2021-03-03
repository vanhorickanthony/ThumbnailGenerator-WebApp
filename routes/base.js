/**
 * The base router sends all regular traffic (non-API traffic) to the frontend, which is build to public.
 */
const router = require('express').Router();

router.get(
    '**',
    function(req, res, next)
    {
        res.redirect('/api/health');
    });

/**
 * Export the base router.
 */
module.exports = router;
