// const { AbilityBuilder, Ability } = require('@casl/ability');

// module.exports = function defineAbilitiesFor(user) {
// 	const { rules, can, cannot } = AbilityBuilder.extract();
    
//     // roles = [
//     //     manager
//     //     , seniormanager
//     //     , rop
//     //     , Partner Manager
//     //     , km
//     //     , teamlead
//     //     , admin
//     //     , marketing
//     //     , cfo
//     // ];
//     console.log('@abilities: ', user);
    

// 	if (user.role === 'manager') {
//         console.log('true');   
// 		can(['read', 'update'], 'User');
// 	} else {
//         cannot(['read', 'update'], 'User');
//     }

// 	return new Ability(rules);
// };

// const ability =  AbilityBuilder.define((can, cannot) => {
// 	can('read', 'all');
// });

// module.exports = function defineAbilitiesFor(user) {
// 	const { rules, can } = AbilityBuilder.extract();
// 	if (user._id == 'JTCub2htNrmdaQnYz') {
// 		can(['read', 'update'], 'Calls', { _id: user.id });
// 	}
// 	return new Ability(rules);
// };\]



// At controller you should to this
// 
// const defineAbilitiesFor = require('../helpers/abilities');
//then 
// const ability = defineAbilitiesFor(req.user);
// console.log(ability.rules);
//ability.throwUnlessCan('read', Calls);

// at db.js you shoulf do this
// const { accessibleRecordsPlugin } = require('@casl/mongoose');

// mongoose.plugin(accessibleRecordsPlugin);

const { AbilityBuilder, Ability } = require('@casl/ability')

function defineAbilitiesFor(user) {
    const { rules, can, cannot } = AbilityBuilder.extract();

    cannot(['crud'], 'all');

    if (user && user.role === 'manager') {
        can('update', 'all');
    }
    if (user && user.role === 'admin') {
        can('update', 'all');
    }

    return new Ability(rules)
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null)

module.exports = function createAbilities(req, res, next) {
  req.ability = req.user ? defineAbilitiesFor(req.user) : ANONYMOUS_ABILITY
  next()
}