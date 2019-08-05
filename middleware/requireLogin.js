module.exports = (req, res, next) => {
	if (!req.user) {
		return res.status(401).send({ error: 'You must be logged in' }); // 401 ==> unauthorized request
	}
	next();
};
