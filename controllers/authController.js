const bcrypt = require('bcryptjs');
const {newUser} = require('../helpers/events');
const debug = require('debug')('auth:controller*');

const {User} = require('../models/user');

exports.createUser = async (req, res, next) => {
	const {error, value} = User.userValidation(req.body);
	if (error) return next(error);
	const {username, password , role} = value;
	const user = new User({username, password, role});
	try {
		await user.save();
	} catch (error) {return next(error);}
	debug('New user: ', user);
	newUser();
	res.status(200).json({
		success: true,
		data: user
	});
};

exports.authUser = async (req, res, next) => {
	const { username, password, role } = req.body;
	const user = await User.findOne({username});
	if (!user) {
		return next({
			message: 'Invalid username or password'
		});
	}

	const validPassword = bcrypt.compare(password, user.password);
	if (!validPassword) {
		return next({
			message: 'Invalid username or password'
		});
	}
	if (role) {
		user.role = role;
	}

	const token = user.generateAuthToken();
	res.status(200).json(
		{
			success: true,
			token
		}
	);
};