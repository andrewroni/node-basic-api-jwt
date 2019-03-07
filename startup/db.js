const mongoose = require('mongoose');
const config = require('config');
const { accessibleRecordsPlugin } = require('@casl/mongoose');


module.exports = function () {
	if (process.env.MONGOOSE_DEBUG === 'true') {
		mongoose.set('debug', true);
	}
	const db = config.get('db');
	const options = {
		useNewUrlParser: true,
		autoIndex: false
	};

	mongoose.plugin(accessibleRecordsPlugin);

	mongoose.Promise = global.Promise;
	mongoose.connect(db, options)
		.then(() => console.log(`MongoDB connected`));
};