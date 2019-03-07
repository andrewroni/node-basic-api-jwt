const createAbilities = require('../helpers/abilities');

module.exports =  app => {
	app.use(createAbilities);
};