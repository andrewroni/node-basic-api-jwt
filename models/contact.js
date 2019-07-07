const {Schema, model} = require('mongoose');

const ContactsSchema = new Schema({
	name: String,
	phone: String,
	email: String,
	site: String,
	source: String,
	description: String,
	assigned: String,
	createdBy: String
}, {
	timestamps: true,
	id: false,
	versionKey: false
});

exports.Contacts = model('Contact', ContactsSchema);