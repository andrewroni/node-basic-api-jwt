const mongoose = require('mongoose');
const Joi = require('joi');

const Rules = new mongoose.Schema({
	view: { 
		type: Boolean,
		default: true 
	},
	edit: { 
		type: Boolean,
		default: false 
	},
	create: { 
		type: Boolean,
		default: false 
	},
	delete: { 
		type: Boolean,
		default: false 
	}
},{
	_id : false
});

const Fields = new mongoose.Schema({
	rw: { 
		type: Array,
		default: [] 
	},
	ro: { 
		type: Array,
		default: [] 
	},
	ds: { 
		type: Array,
		default: [] 
	}
},{
	_id : false
});

const Permissions = new mongoose.Schema({
	module_name: String,
	own_sites: {
		type: Boolean,
		default: false
	},
	assigned: {
		type: Boolean,
		default: false
	},
	rules: {
		type: Rules,
		default: Rules
	},
	fields: {
		type: Fields,
		default: Fields
	}
},{
	strict:false,
	_id : false
});

const rolesSchema = new mongoose.Schema({
	_id: String,
	name: String,
	desc: String,
	custom_role: {
		type: Boolean,
		default: false
	},
	permissions: [Permissions]
},{
	toJSON: { virtuals: true },
	versionKey: false,
	collection: 'roles_new'
});

rolesSchema.statics.validateQuery = query => {
	const schema = {
		id:Joi.array(),
		custom_role: Joi.boolean(),
		query: Joi.object().pattern(Joi.string(), Joi.alternatives().try(Joi.string(), Joi.object())),
		options: {
			select: Joi.object().pattern(Joi.string(), Joi.number().min(0).max(1)),
			sort: Joi.object().pattern(Joi.string(), Joi.number().min(-1).max(1)),
			limit:Joi.number().min(1).max(100),
			skip:Joi.number().min(0),
			page:Joi.number().min(1),
			deleted: Joi.bool(),
			schema:Joi.bool()
		}  
	};
	return  Joi.validate(query, schema, { convert: true });
};

rolesSchema.statics.validateBody = body => {
	const schema = {
		name: Joi.string().min(2).max(255),
		desc: Joi.string(),
		custom_role: Joi.boolean(),
		permissions: Joi.array().items(Joi.object().keys({
			module_name: Joi.string(),
			own_sites: Joi.boolean(),
			assigned: Joi.boolean(),
			rules: Joi.object().keys({
				view: Joi.boolean(),
				edit: Joi.boolean(),
				create: Joi.boolean(),
				delete: Joi.boolean()
			}),
			fields: Joi.object().keys({
				rw: Joi.array().items(Joi.string()),
				ro: Joi.array().items(Joi.string()),
				ds: Joi.array().items(Joi.string())
			})
		}))
	};
	return Joi.validate(body, schema, {convert:true});
};

rolesSchema.statics.validatePermission = body => {
	const schema = {
		module_name: Joi.string().required(),
		own_sites: Joi.boolean(),
		assigned: Joi.boolean(),
		rules: Joi.object().keys({
			view: Joi.boolean(),
			edit: Joi.boolean(),
			create: Joi.boolean(),
			delete: Joi.boolean()
		}),
		fields: Joi.object().keys({
			rw: Joi.array().items(Joi.string()),
			ro: Joi.array().items(Joi.string()),
			ds: Joi.array().items(Joi.string())
		})
	};
	return Joi.validate(body, schema, {convert:true});
};
exports.Role = mongoose.model('Role', rolesSchema);
