const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middleware/requireLogin');

module.exports = app => {
	app.post('/api/stripe', requireLogin, async (req, res) => {
		const charge = await stripe.charges.create({
			amount: 500,
			currency: 'usd',
			description: '$5 for 5 Survey Credits',
			source: req.body.id
		});

		req.user.credits += 5; // we have the user model in the req because of passport
		const user = await req.user.save();

		res.send(user);
	});
};
