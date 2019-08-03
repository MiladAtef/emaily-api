const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');
// mongoose.connect(keys.mongoURI);
mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

require('./models/user');
require('./services/passport');

const app = express();

//using cookie sessions
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days session in milliseconds
		keys: [keys.cookieKey] //we can put more than one key(just for security purposes) and the library will automatically pick random one
	})
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`app is running on port ${PORT}`);
});
