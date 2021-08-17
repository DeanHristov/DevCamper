const express = require('express');

const {
    registerNewUser, signIn, getMyself
} = require("../controllers/auth");

const { protectRoute } = require('../middlewares/auth')
const router = express.Router();

router.post('/register', registerNewUser)
router.post('/signIn', signIn)
router.get('/me', protectRoute, getMyself)

module.exports = router;
