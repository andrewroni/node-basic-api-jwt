const bcrypt = require('bcryptjs');

const {User} = require('../models/user');
const mongoose = require('mongoose');

exports.createUser = async (req, res, next) => {
    const { username, password } = req.body;
    const user = new User({username, password});
    await user.save();
    res.status(200).json(
        {
            success: true,
            data: {
                user
            }
        }
    );
};

exports.authUser = async (req, res, next) => {
    const { username, password } = req.body;
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

    const token = user.generateAuthToken();
    res.status(200).json(
        {
            success: true,
            token
        }
    );
    
};

exports.getUsers = async (req, res, next) => {
    console.log(req.user);
    
    const users = await User.find({}, '-password').lean();  
    res.status(200).json(
        {
            success: true,
            data: users
        }
    );  
};

exports.getUser = async (req, res, next) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next({ message: 'Id not valid'});
      }
    const user = await User.findById(id, '_id username').lean();
    if (!user) {
        return next({
            message: `User with id ${_id} was not found`
        });
    }
    res.status(200).json({
        success: true,
        data: user
    });
    
};