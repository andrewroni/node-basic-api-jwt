const mongoose = require('mongoose');
const debug = require('debug')('contacts:controller*');

const {Contacts} = require('../models/contacts');

exports.createContact = async (req, res, next) => {
    const { name, phone , email } = req.body;
    const contact = new Contacts({name, phone , email});
    await contact.save();
    debug('New contact: ', contact);
    res.status(200).json(
        {
            success: true,
            data: {
                contact
            }
        }
    );
};

exports.getContacts = async (req, res, next) => {
    
};

exports.getContact = async (req, res, next) => {
    
};

exports.updateContact = async (req, res, next) => {
    
};

exports.removeContact = async (req, res, next) => {
    
};
