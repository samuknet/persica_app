module.exports = {
	super_secret : 'balaji.io',
	unprotected: ['/register', '/login', '/song', '/notification/admin', '/group', '/group/0'] // A list of routes not covered by jwt authentication
};