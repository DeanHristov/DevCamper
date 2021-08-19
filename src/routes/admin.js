const express = require('express');

const router = express.Router();
const UserModule = require('../models/Users');
const advanceFiltering = require('../middlewares/advanceFiltering');
const { protectRoute, grantAccessToRoles } = require('../middlewares/auth')
const {
    deleteExistingUser, createNewUser, modifyExistingUser,
    getAllUsers, getSingleUser
} = require('../controllers/admin');
const {USER_ROLES} = require("../commons/constants");

router.use(protectRoute);
router.use(grantAccessToRoles(USER_ROLES.ADMIN));

router.route('/')
    .get(advanceFiltering(UserModule), getAllUsers)
    .post(createNewUser);

router.route('/:userId')
    .delete(deleteExistingUser)
    .put(modifyExistingUser)
    .get(getSingleUser);

module.exports = router;
