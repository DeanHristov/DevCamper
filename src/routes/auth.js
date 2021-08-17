const express = require('express');

const {
    registerNewUser, signIn
} = require("../controllers/auth");

const router = express.Router();

router.post('/register', registerNewUser)
router.post('/signIn', signIn)

module.exports = router;
