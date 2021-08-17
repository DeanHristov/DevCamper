const express = require('express');

const {
    registerNewUser
} = require("../controllers/auth");

const router = express.Router();

router.route('/register')
    .post(registerNewUser)

module.exports = router;
