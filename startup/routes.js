const express = require('express');
const cors = require('cors');

const auth = require('../routes/auth');
const users = require('../routes/users');

const corsOptions = {
	origin: '*'
};

const apiroute = (process.env.NODE_ENV === 'staging') ? 'v1_staging' : 'v1' ;

module.exports = app => {
    app.use(express.json(corsOptions));
	app.use(cors());
    app.use(`/api/${apiroute}/auth`, auth);
    app.use(`/api/${apiroute}/users`, users);
};