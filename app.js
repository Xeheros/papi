const bodyParser = require('body-parser');
const express = require('express');
const app = express();

require('dotenv').config();

const jsonParser = bodyParser.json();

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

app.get('/ranks', jsonParser, ((req, res) => {
    res.send({ ranks: `Not implemented yet`,});
}));

app.post('/rank/:id', urlEncodedParser, ((req, res) => {
    const { id } = req.params;
    const { score } = req.body;

    if(!score)
    {
        res.status(418).send({ message: 'A score is required!'});
        return;
    }

    res.send({ score: `Player ${id} has setup a score of ${score}`,});
}));

app.listen(process.env.API_PORT, () =>
{
    console.log(`Pearfect API is now running on http://localhost:${process.env.API_PORT}`);
});