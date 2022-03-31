// Imports
const express = require('express');
const usersController = require('./routes/users');

// Router
exports.router = (function() {
    const router = express.Router();

    // Users
    router.route('/user/register/').post(usersController.register);
    router.route('/user/login/').post(usersController.login);

    return router;
})();