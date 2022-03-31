// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

// Routes
module.exports = {
    register: function(req, res) {
        const email = req.body.email;

        // Check if email already exists
        models.User.findOne({
           attributes: ['id'],
           where: { email: email }
        })
        .then(function(user){
            if(user)
                return res.status(409).json({ error: 'User already exists.' });

            bcrypt.hash(email, "abc", function(hashErr, hash){
                models.User.create({
                    id: hash,
                    email: email
                })
                .then(function(newUser){
                    return res.status(201).json({ message: 'User created!', userId: newUser.id });
                })
                .catch(function(err){
                    return res.status(500).json({ error: 'Can\'t add user.', type: err});
                });
            });
        })
        .catch(function(err){
            return res.status(500).json({ error: 'Unable to verify user.' });
        });
    },
    login: function(req, res) {

    }
}