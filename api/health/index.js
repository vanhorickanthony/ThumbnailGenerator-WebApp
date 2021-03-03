/**
 * Define endpoint data logic.
 */

exports.status = (req, res, next) =>
{
    res.status(200).json(
        {
            status: 'Up'
        });
};
