// Imports
const jwt = require('../utils/jwt.utils');

module.exports = {
    generate: function(req, res) {
        if(!req.query.id)
            return res.status(400).send("Missing id");

        return res.status(200).send(jwt.generate(req.query.id));
    }
}