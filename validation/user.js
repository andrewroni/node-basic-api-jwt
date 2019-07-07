const Joi = require('joi');

const userSchema = {
	username: Joi.string().min(2).max(50).required(),
	password: Joi.string().min(2).max(50).required(),
	role: Joi.string()
};

module.exports = schema => {
	schema.statics.userValidation = body => Joi.validate(body, userSchema);
};