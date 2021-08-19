const express = require('express');

const {
    registerNewUser, signIn, getMyself,
    forgotPassword, resetPassword, modifyUser,
    updateUserPassword,
} = require("../controllers/auth");

const { protectRoute } = require('../middlewares/auth')
const router = express.Router();

router.post('/register', registerNewUser)
router.post('/signIn', signIn)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:resetToken', resetPassword)
router.put('/update-users', protectRoute, modifyUser)
router.put('/change-password', protectRoute, updateUserPassword)
router.get('/me', protectRoute, getMyself)

module.exports = router;
