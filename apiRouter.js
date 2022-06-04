/*
 * Developed by Xeheros.
 * Copyright (c) 2022.
 */

// Imports
const express = require('express');
const statusController = require('./routes/status');
const tokensController = require('./routes/tokens');
const usersController = require('./routes/users');
const scoresController = require('./routes/scores');

// Router
exports.router = (function() {
    const router = express.Router();

    //#region Status routes
    router.route('/status').get(statusController.check);
    //#endregion

    //#region Token routes
    router.route('/authenticate').get(tokensController.generate);
    //#endregion

    //#region Users routes
    router.route('/user/check').get(usersController.check);
    router.route('/user/register').post(usersController.register);
    //router.route('/user/login').post(usersController.login);
    //#endregion

    //#region Scores routes
    router.route('/scores/:year?/:month?').get(scoresController.list);
    router.route('/score/add').post(scoresController.add);
    //#endregion

    return router;
})();