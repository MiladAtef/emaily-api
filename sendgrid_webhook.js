var localtunnel = require('localtunnel');

localtunnel(5000, { subdomain: 'miladmiladmilad' }, function(err, tunnel) {
	console.log('LT running');
});
