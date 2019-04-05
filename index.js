const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
require('./startup/db')();
require('./startup/parser')(app);
require('./startup/jwt')(app);
require('./startup/ability')(app);
require('./startup/routes')(app);
require('./middleware/error')(app);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server started at post ${PORT}`));