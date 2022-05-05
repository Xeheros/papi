const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = require('./apiRouter').router;

require('dotenv').config();

const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

app.use(urlEncodedParser);
app.use(jsonParser);

app.use('/api/', router);

app.listen(process.env.API_PORT, () =>
{
    console.log(`Pearfect API is now running on http://localhost:${process.env.API_PORT}`);
});