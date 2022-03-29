const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.json());

/*app.get('/rank', ((req, res) => {

}));*/

app.post('/rank/:id', ((req, res) => {
    const { id } = req.params;
    const { score } = req.body;

    if(!score)
    {
        res.status(418).send({ message: 'A score is required!'});
    }

    res.send(
        { rank: `Player ${id} has setup a score of ${score}`});
}));

app.listen(process.env.API_PORT, () =>
{
    console.log(`Pearfect API is now running on http://localhost:${process.env.API_PORT}`);
});