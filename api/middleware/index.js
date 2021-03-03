const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const config = require('../../config/config')


exports.jwtCheck = jwt(
    {
        secret: jwks.expressJwtSecret(
            {
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${config.Auth0.DOMAIN}/.well-known/jwks.json`
            }),
        audience: `${config.Auth0.API}/`,
        issuer: `${config.Auth0.DOMAIN}/`,
        algorithms: ['RS256']
    });

// Check for an authenticated admin user
exports.adminCheck = (req, res, next) => {

    const roles = req.user[config.Auth0.NAMESPACE] || [];

    /**
     * Check if roles contain admin role.
     */
    if (roles.indexOf('admin') > -1)
    {
        next();
    }
    else
    {
        res.status(401).send({message: 'Not authorized for admin access'});
    }
}

