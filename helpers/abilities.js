const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(user) {
	const { rules, can, cannot } = AbilityBuilder.extract();

	// permissions for 'null' user
	cannot(['crud'], 'all');

	if (user && user.role === 'manager') {
		// manager
		// -- module_name
		// ---- contacts
		// ------ view, edit, create: true / delete: false
		// ---- leads
		// ------ view, edit, create: true / delete: false
		// ---- calls
		// ------ view: true / edit, create, delete: false
		// ---- core
		// ------ view, edit, create, delete: false
		// ---- statistic
		// ------ view, edit, create, delete: false
		// ---- settings
		// ------ view, edit, create, delete: false
		// ---- payment
		// ------ view, edit, create, delete: false
		can(['create', 'read', 'update'], ['Contacts', 'Leads']);
		can(['read'], ['Calls']);
		cannot('crud', ['Core', 'Statistic', 'Settings', 'Payments']);
	} else if (user && user.role === 'seniormanager') {
		// seniormanager
		// -- module_name
		// ---- contacts
		// ------ view, edit, create, delete: true
		// ---- leads
		// ------ view, edit, create, delete: true
		// ---- calls
		// ------ view: true / edit, create, delete: false
		// ---- core
		// ------ view, edit, create, delete: false
		// ---- statistic
		// ------ view: true / edit, create, delete: false
		// ---- settings
		// ------ view: true / edit, create, delete: false
		// ---- payments
		// ------ view, edit, create, delete: false
		can(['create', 'read', 'update', 'delete'], ['Contacts', 'Leads']);
		can(['read'], ['Calls', 'Statistic', 'Settings']);
		cannot('crud', ['core', 'payments']);
	} else if (user && user.role === 'Partner Manager') {
		can('manage', 'all');
	} else if (user && user.role === 'km') {
		can('manage', 'all');
	} else if (user && user.role === 'teamlead') {
		can('manage', 'all');
	} else if (user && user.role === 'admin') {
		// admin
		// -- module_name
		// ---- users
		// ------ view, edit, create, delete: true
		// ---- webforms
		// ------ view, edit, create, delete: true
		// ---- contacts
		// ------ view, edit, create, delete: true
		// ---- leads
		// ------ view, edit, create, delete: true
		// ---- calls
		// ------ view, edit, create, delete: true
		// ---- core
		// ------ view, edit: true / create, delete: false
		// ---- statistic
		// ------ view, edit, create, delete: true
		// ---- settings
		// ------ view, edit, create, delete: true
		// ---- payments
		// ------ view, edit, create, delete: true
		can(['crud'], ['User','Contacts', 'Leads', 'Calls', 'Webforms', 'Statistic', 'Settings', 'Payments']);
		can(['read', 'update'], 'Core');
	} else if (user && user.role === 'marketing') {
		can('manage', 'all');
	} else if (user && user.role === 'cfo') {
		can('manage', 'all');
	}

	return new Ability(rules);
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null);

module.exports = function createAbilities(req, res, next) {
	req.ability = req.user ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY;
	next();
};