// Imports
const express = require('express');
const statusController = require('./routes/status');
const tokensController = require('./routes/tokens');
const usersController = require('./routes/users');
const scoresController = require('./routes/scores');

// Router
exports.router = (function() {
    const router = express.Router();

    // Status
    router.route('/status').get(statusController.check);

    // Token
    router.route('/authenticate').get(tokensController.generate);

    // Users
    router.route('/user/register').post(usersController.register);
    router.route('/user/login').post(usersController.login);

    // Scores
    router.route('/scores/:year?/:month?').get(scoresController.list);
    router.route('/score/add').post(scoresController.add);

    return router;
})();