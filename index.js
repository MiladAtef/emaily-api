const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');

mongoose.connect(
	keys.mongoURI,
	{
		useNewUrlParser: true,
		useCreateIndex: true
	},
	err => {
		if (!err) {
			console.log('MongoDB Connection Succeeded.');
		} else {
			console.log('Error in DB connection: ' + err);
		}
	}
);

require('./models/user');
require('./models/Survey');
require('./services/passport');

const app = express();

app.use(bodyParser.json());

//using cookie sessions
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days session in milliseconds
		keys: [keys.cookieKey] //we can put more than one key(just for security purposes) and the library will automatically pick random one
	})
);
app.use(passport.initialize());
app.use(passport.session());

// routes
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// this chunk of code to serve build folder from react in production
// and it must be here in the bottom of the file (because of the above routes)
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	//send the index.html file if the route doesn't exist in the server
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app is running on port ${PORT}`);
});
