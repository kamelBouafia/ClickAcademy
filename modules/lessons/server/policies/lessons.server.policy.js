'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Lessons Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/formations/:formationId/api/lessons',
			permissions: '*'
		}, {
			resources: '/api/formations/:formationId/api/lessons/:lessonId',
			permissions: '*'
		}]
	}, {
        roles: ['admin'],
        allows: [{
            resources: '/api/lessons',
            permissions: '*'
        }, {
            resources: '/api/lessons/:lessonId',
            permissions: '*'
        }]
    }, {
		roles: ['user'],
		allows: [{
			resources: '/api/formations/:formationId/api/lessons',
			permissions: ['get', 'post']
		}, {
			resources: '/api/formations/:formationId/api/lessons/:lessonId',
			permissions: ['get']
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/formations/:formationId/api/lessons',
			permissions: ['get']
		}, {
			resources: '/api/formations/:formationId/api/lessons/:lessonId',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// If an lesson is being processed and the current user created it then allow any manipulation
	if (req.lesson && req.user && req.lesson.user.id === req.user.id) {
		return next();
	}

	// Check for user roles
	acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
		if (err) {
			// An authorization error occurred.
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}
	});
};
