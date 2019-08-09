const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url'); // built in module
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const requireCredits = require('../middleware/requireCredits');
const Survey = mongoose.model('surveys');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

module.exports = app => {
	app.get('/api/surveys', requireLogin, async (req, res) => {
		// we fetch all the surveys that belongs to that user
		// but we exclude the recipients property from each survey
		const surveys = await Survey.find({ _user: req.user.id }).select({
			recipients: false
		});
		res.send(surveys);
	});

	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send('thank you for voting!');
	});

	app.post('/api/surveys/webhooks', (req, res) => {
		const p = new Path('/api/surveys/:surveyId/:choice'); // here we make a matcher

		_.chain(req.body)
			.map(({ email, url }) => {
				const pathname = new URL(url).pathname; // to just get the path name out of the url
				const match = p.test(pathname); // if the pathname contains the surveyId and the choice, match will be an object with both properties, and if one of them doesn't exist match will be null
				if (match) {
					return { ...match, email };
				}
			})
			.compact()
			.uniqBy('email', 'surveyId')
			.each(({ email, surveyId, choice }) => {
				//first we find the survey by the id
				// and inside that survey we find the email with responded no
				// then in the second object we update
				// we increase the choice (yes or no) by one
				// and then we make responded true
				// we set the date
				// the last step we exexute the query by (exec)
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: { email, responded: false }
						}
					},
					{
						$inc: { [choice]: 1 },
						$set: { 'recipients.$.responded': true },
						lastResponded: new Date()
					}
				).exec();
			})
			.value();

		//compact removes any undefined elements in the array
		// uniqBy func will remove any duplicate elements (objects) that has the same two properties, surveyId and email
		res.send({});
	});

	// create survey
	app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(',').map(email => ({ email: email.trim() })),
			dateSent: new Date(),
			_user: req.user.id
		});

		const mailer = new Mailer(survey, surveyTemplate(survey));
		try {
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();
			res.send(user);
		} catch (e) {
			res.status(422).send(e); // 422 ===> unprocessable entity
		}
	});
};
