const express = require('express');

const {
    registerNewUser, signIn, getMyself,
    forgotPassword, resetPassword
} = require("../controllers/auth");

const { protectRoute } = require('../middlewares/auth')
const router = express.Router();

router.post('/register', registerNewUser)
router.post('/signIn', signIn)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:resetToken', resetPassword)
router.get('/me', protectRoute, getMyself)

module.exports = router;
