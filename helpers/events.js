const EventEmitter = require('eventemitter3');

const myEmitter = new EventEmitter();

myEmitter.on('new_user', () => {
	console.log('new user was created!');
});

exports.newUser = () => {
	myEmitter.emit('new_user');
};

exports.newContact = () => {
	myEmitter.emit('new_contact');
};

exports.userContact = () => {
	myEmitter.emit('new_contact');
};