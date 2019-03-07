const jwt = require('express-jwt');
const config = require('config');
const createAbilities = require('../helpers/abilities');

module.exports =  app => {
app.use(jwt({
    secret: config.get('jwtPrivateKey'),
    credentialsRequired: true,
    getToken: req => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } 
        return null;
    }
    }).unless({path: ['/api/v1/auth/login', '/api/v1/auth/signup']}));
app.use(createAbilities);
};