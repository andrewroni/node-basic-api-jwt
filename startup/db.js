const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
	if (process.env.MONGOOSE_DEBUG === 'true') {
		mongoose.set('debug', true);
	}
	const db = config.get('db');
	const options = {
		useNewUrlParser: true,
		autoIndex: false
	};
	mongoose.connect(db, options)
		.then(() => console.log(`MongoDB connected at adress ${db}`));
};
