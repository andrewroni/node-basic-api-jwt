const {Schema, model} = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    password :{
        type: String,
        require: true
    }
});

UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id.toHexString()}, config.get('jwtPrivateKey'));
};

UserSchema.pre('save', function (next) {
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

const User = model('User', UserSchema);

module.exports = {User};