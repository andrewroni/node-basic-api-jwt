const debug = require('debug')('contacts:controller*');

const {Contact} = require('../models/contact');

exports.createContact = async (req, res, next) => {
	const { name, phone , email } = req.body;
	const contact = new Contact({name, phone , email});
	try {
		await contact.save();
	} catch (error) {next(error);}
	debug('New contact: ', contact);
	res.status(200).json({
		success: true,
		data: contact
	});
};

exports.getContacts = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: []
	});
};

exports.getContact = async (req, res, next) => {
	res.status(200).json({
		success: true
	});
};

exports.updateContact = async (req, res, next) => {
	res.status(200).json({
		success: true
	});
};

exports.removeContact = async (req, res, next) => {
	res.status(200).json({
		success: true
	});
};
