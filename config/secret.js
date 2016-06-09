module.exports = {
	super_secret : 'balaji.io',
	unprotected: ['/register', '/login', '/song', '/notification/admin'] // A list of routes not covered by jwt authentication
};