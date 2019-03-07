const mongoose = require('mongoose');
const debug = require('debug')('user:controller*');

const {User} = require('../models/user');

exports.getUsers = async (req, res, next) => {
    // v1 
    if (req.ability.can('read', 'User')) {
        const users = await User.find({}, '_id username role').lean();
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
    // Validating mongoose ID
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next({ message: 'Id not valid'});
    }
    const user = await User.findById(id, '_id username').lean();
    if (!user) {
        return next({message: `User with id '${id}' was not found`});
    }
    res.status(200).json({
        success: true,
        data: user
    });
};

exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    // Validating mongoose ID
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next({ message: 'Id not valid'});
    }
    if (!req.ability.can('update', 'User')) {
        return next({message: 'No access'});
    }
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
        return next({message: `User with id '${id}' was not found`});
    }
    res.status(200).json({
        success: true,
        data: user
    });
};

exports.removeUser = async (req, res, next) => {
    const { id } = req.params;
    // Validating mongoose ID
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next({ message: 'Id not valid'});
    }
    const user = await User.findOneAndDelete({_id: id});
    if (!user) {
        return next({
            message: `User with id '${id}' was not found`
        });
    }
    res.status(200).json({
        success: true,
        data: user
    });
};