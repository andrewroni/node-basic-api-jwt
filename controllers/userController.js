const bcrypt = require('bcryptjs');
const debug = require('debug')('controller:user*');

const {User} = require('../models/user');
const mongoose = require('mongoose');
const defineAbilitiesFor = require('../helpers/abilities');

exports.createUser = async (req, res, next) => {
    const { username, password , role} = req.body;
    const user = new User({username, password, role});
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

exports.getUsers = async (req, res, next) => {
    // v1 
    if (req.ability.can('read', 'User')) {
        const users = await User.find({});
        return res.status(200).json({
                success: true,
                data: users
            }); 
    }
    next({message: 'No access'});

    // v2
    // try {
    //     const users = await User.find({});  
    //     req.ability.throwUnlessCan('read', users);
    //     res.status(200).json(
    //         {
    //             success: true,
    //             data: users
    //         }
    //     );  
    // } catch (e) {
    //     next(e);
    // }


    
//  User.accessibleBy(req.ability).find().lean()
//      .then(users => {
//         res.status(200).json(
//             {
//                 success: true,
//                 data: users
//             });
//     })
//     .catch(next)  
    // User.accessibleBy(req.ability).find({})
    // .then(users => {
    //   res.send({ users })
    // })
    // .catch(next)
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