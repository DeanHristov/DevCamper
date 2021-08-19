const express = require('express');

const router = express.Router();
const {
    getAllBootCamps, getBootcampById, creatBootCamp,
    deleteBootCamp, updateBootCamp, modifyBootCamp, uploadBootcampPhoto
} = require('../controllers/bootcamps');
const { protectRoute, grantAccessToRoles } = require('../middlewares/auth')
const BootcampModel = require('../models/Bootcamps');
const advanceFiltering = require('../middlewares/advanceFiltering');

const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const { USER_ROLES } = require('../commons/constants')
const populateParams = {
    path: 'courses',
    select: 'title -bootcamp'
};

router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/')
    .get(advanceFiltering(BootcampModel, populateParams), getAllBootCamps)
    .post(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), creatBootCamp)

router.route('/:id')
    .get(getBootcampById)
    .delete(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), deleteBootCamp)
    .put(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), updateBootCamp)
    .patch(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), modifyBootCamp)

router.route('/:id/photo')
    .put(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), uploadBootcampPhoto);

module.exports = router;
