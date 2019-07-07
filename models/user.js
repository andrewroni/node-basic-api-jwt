const {Schema, model} = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userValidation = require('../validation/user');

// const { accessibleRecordsPlugin } = require('@casl/mongoose');

const userSchema = new Schema({
	username: {
		type: String,
		trim: true
	},
	password: {
		type: String,
		require: true
	},
	role: {
		type: String,
		ref: 'Role'
	}
}, {
	id: false,
	versionKey: false
});

userSchema.plugin(userValidation);

userSchema.methods.generateAuthToken = function () {
	return jwt.sign({_id: this._id.toHexString(), role: this.role}, config.get('jwtPrivateKey'));
};

userSchema.pre('save', function (next) {
	if (this.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(this.password, salt, (err, hash) => {
				if (err) {
					next(err);
				} else {
					this.password = hash;
					next();
				}
			});
		});
	} else {
		next();
	}
});

exports.User = model('User', userSchema);