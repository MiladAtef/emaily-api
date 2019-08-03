//this file to figure out what set of credentials to return

// the NODE_ENV variable will be production on heroku
if (process.env.NODE_ENV === 'production') {
	//we are in production, return the prod set of keys
	module.exports = require('./prod');
} else {
	//we are in development, return the dev set of keys
	module.exports = require('./dev');
}
