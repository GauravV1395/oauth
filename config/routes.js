const express = require('express');
const router = express.Router();
const { userController } = require('../app/controllers/userController');

router.use('/users', userController);

module.exports = {
    routes : router
}