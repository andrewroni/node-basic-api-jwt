const bcrypt = require('bcryptjs');
const debug = require('debug')('auth:controller*');

const {User} = require('../models/user');

exports.createUser = async (req, res, next) => {
    const { username, password , role} = req.body;
    const user = new User({username, password, role});
    await user.save();
    debug('New user: ', user);
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
    debug('login');
    console.log('login');
    
    const { username, password, role } = req.body;
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
    if (role) {
        user.role = role;
    }

    const token = user.generateAuthToken();
    res.status(200).json(
        {
            success: true,
            token
        }
    );
};