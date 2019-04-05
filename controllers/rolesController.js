const {Role} = require('../models/roles');
const {permittedFieldsOf} = require('@casl/ability/extra');
const debug = require('debug')('roles:controller*');

exports.getRoles = async (req, res, next) => {
	// if (req.ability.cannot('read', 'roles')) {
	// 	return next({message: 'CASL: No access'});
	// }
	//check if query is valid
	const { error, value: validated } = Role.validateQuery(req.query);
	if (error) return next({message: error.details[0].message});
	const select = `-${permittedFieldsOf(req.ability, 'ds', 'roles').join(' -')}`;
	const roles = await Role.find(validated, select).lean();
	return roles
		? res.status(200).json({
			success: true,
			data: roles
		})
		: next({ message: 'No roles found'});	
};

exports.getRole = async (req, res, next) => {
	if (!req.ability || req.ability.cannot('read', 'roles')) {
		return next({message: 'CASL: No access'});
	}
	const select = `-${permittedFieldsOf(req.ability, 'ds', 'roles').join(' -')}`;
	const role = await Role.findById(req.params.id, select);
	return role
		? res.status(200).json(role)
		: next({message: 'Role was not found'});
};

exports.editRole = async (req, res, next) => {
	if (req.ability.cannot('update', 'roles')) {
		return next({message: 'CASL: No access'});
	}
	const {error, value: validated_body } = Role.validateBody(req.body);
	if(error) return next({message: error.message});

	const requestedFields = Object.keys(validated_body);
	const allowedFields = permittedFieldsOf(req.ability, 'rw', 'roles');
	debug('requested fields', requestedFields);
	debug('allowed fields', allowedFields);
	const result = requestedFields.filter(el => !allowedFields.includes(el));
	if (result.length) return next({message: `CASL: [${result}] not allowed to modify`});
	Role.findByIdAndUpdate(req.params.id, validated_body, {new: true})
		.then(result => {
			if(result) {
				req.ability.update(req.params.id);
				return res.status(200).json(result);
			}	
			return next({message: 'Role not found'});
		})
		.catch(err => next({message: err}));
};

exports.editRolePermissions = async (req, res, next) => {
	if (req.ability.cannot('update', 'roles') || req.ability.cannot('rw', 'roles', 'permissions' )) {
		debug('cannot update roles',req.ability.cannot('update', 'roles'));		
		return next({message: 'CASL: No access'});
	}
	const {error, value: validated_body } = Role.validatePermission(req.body);
	if(error) {
		return next({message: error.message});
	}
	const role = await Role.findById(req.params.id);
	if (!role) return next({message: 'Role was not found'});

	const query = {};
	const operators = {};
	const set = {};
	// if permission for provided module NOT exists
	if(!role.permissions.find(el => el.module_name === validated_body.module_name )){
		debug('new perms');
		Object.assign(query, {_id: req.params.id});
		Object.assign(operators, {
			'$push': {
				permissions: validated_body
			}
		});
	// if permission for provided module exist
	} else {
		debug('old perms');
		Object.assign(query, {
			_id: req.params.id,
			'permissions.module_name' : validated_body.module_name
		});
		for (const path of Object.keys(validated_body)) {
			Object.assign(set, {['permissions.$.'+path]: validated_body[path]});
		}
		Object.assign(operators, {
			'$set': set
		});
	}
	const result = await Role.findOneAndUpdate(query, operators, {new: true});
	return result
		? res.status(200).json(result)
		: next({message: 'Update faild'});
};
exports.removeRolePermission = async (req, res, next) => {
	if (req.ability.cannot('update', 'roles') || req.ability.cannot('rw', 'roles', 'permissions' )) {
		debug('cannot update roles',req.ability.cannot('update', 'roles'));		
		return next({message: 'CASL: No access'});
	}
	const {error, value: validated_body } = Role.validatePermission(req.body);
	if(error) {
		return next({message: error.message});
	}
	const role = await Role.findById(req.params.id);
	if (!role) {
		return next({message: 'Role was not found'});
	}
	if(!role.permissions.find(el => el.module_name === validated_body.module_name )){
		debug('permission not found (no such module)');
		return next({message: 'Faild to update permissions. Module not found'});
	} 
	debug('removing perm');
	const query  = {
		_id: req.params.id
	};
	const operators = {
		'$pull': {
			permissions : validated_body
		}
	};
	const result = await Role.findOneAndUpdate(query, operators, {new: true});
	return result
		? res.status(200).json(result)
		: next({message: 'Update faild'});
};

exports.createRole = async (req, res, next) => {
	// if (req.ability.cannot('read', 'roles')) {
	// 	return next({message: 'CASL: No access'});
	// }
	const {error, value: validated_body } = Role.validateBody(req.body);
	if(error) return next({message: error.message});
	const role = new Role(validated_body);
	await role.save().catch(err => next({message: err.message}));
	return res.status(200).json(role);
};

exports.removeRole = async (req, res, next) => {
	if (req.ability.cannot('delete', 'roles')) {
		return next({message: 'CASL: No access'});
	}
	const role = await Role.findById(req.params.id);
	if(!role)
		return next({message: `Role with id '${req.params.id}' was not found`});
	const { ok: success } = await Role.deleteOne({_id: role._id});
	return success
		? res.status(200).json({
			success: true,
			message: `Role with id '${req.params.id}' was deleted`
		})
		: next({message:'Delete failed'});
};
