const {Schema, model} = require('mongoose');

const ContactsSchema = new Schema({
    name: String,
    assigned: String,
    phone: String,
    email: String,
    servicetype: String,
    site: String,
    cource: String,
    status: String,
    leadqual: String,
    callback: String,
    description: String
}, {
    timestamps: true
});

const Contacts = model('Contacts', ContactsSchema);
module.exports = Contacts;