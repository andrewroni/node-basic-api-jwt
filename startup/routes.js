const auth = require('../routes/auth');
const users = require('../routes/users');
const contacts = require('../routes/contacts');

const apiroute = (process.env.NODE_ENV === 'staging') ? 'v1_staging' : 'v1' ;

module.exports = app => {
    app.use(`/api/${apiroute}/auth`, auth);
    app.use(`/api/${apiroute}/users`, users);
    app.use(`/api/${apiroute}/contacts`, contacts);
};