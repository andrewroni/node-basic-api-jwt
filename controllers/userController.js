const mongoose = require('mongoose');
const debug = require('debug')('user:controller*');

const {User} = require('../models/user');

exports.getUsers = async (req, res, next) => {
	const users = await User.find({}).lean();
	return users
		? res.status(200).json(users)
		: next({message: 'Users was not found'});
};

exports.getUser = async (req, res, next) => {
	const { id } = req.params;
	// Validating mongoose ID
	if(!mongoose.Types.ObjectId.isValid(id)) {
		return next({ message: 'Id not valid'});
	}
	const user = await User.findById(id, '_id username').populate('role').lean();
	if (!user) {
		return next({message: `User with id '${id}' was not found`});
	}
	res.status(200).json({
		success: true,
		data: user
	});
};

exports.updateUser = async (req, res, next) => {
	const { id } = req.params;
	// Validating mongoose ID
	if(!mongoose.Types.ObjectId.isValid(id)) {
		return next({ message: 'Id not valid'});
	}
	if (!req.ability.can('update', 'User')) {
		return next({message: 'No access'});
	}
	const user = await User.findByIdAndUpdate(id, req.body);
	if (!user) {
		return next({message: `User with id '${id}' was not found`});
	}
	res.status(200).json({
		success: true,
		data: user
	});
};

exports.removeUser = async (req, res, next) => {
	const { id } = req.params;
	// Validating mongoose ID
	if(!mongoose.Types.ObjectId.isValid(id)) {
		return next({ message: 'Id not valid'});
	}
	const user = await User.findOneAndDelete({_id: id});
	if (!user) {
		return next({
			message: `User with id '${id}' was not found`
		});
	}
	res.status(200).json({
		success: true,
		data: user
	});
};