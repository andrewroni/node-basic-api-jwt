const express = require('express');

const app = express();

require('./startup/db')();
require('./startup/parser')(app);
require('./startup/jwt')(app);
require('./startup/routes')(app);
require('./startup/error')(app);

// const errorHandler = require('./startup/error-handler');
// app.use(errorHandler);


const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server started at post ${PORT}`));
