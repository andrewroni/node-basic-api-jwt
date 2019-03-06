const express = require('express');

const app = express();

require('./startup/parser')(app);
require('./startup/jwt')(app);
require('./startup/routes')(app);
require('./startup/error')(app);
require('./startup/db')();

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server started at post ${PORT}`));
