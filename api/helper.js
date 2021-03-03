const config = require('../config/config')


/**
 * Helper function for checking user privileges on a resource.
 */
exports.privilegeCheck = (reqUser, owner) => {

    const roles = reqUser[`${config.Auth0.NAMESPACE}/roles`] || [];

    /**
     * Check if roles contain admin role.
     */
    return (roles.indexOf('admin') > -1) || (reqUser.sub === owner);
}
