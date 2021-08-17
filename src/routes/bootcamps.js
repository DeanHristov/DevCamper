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
const populateParams = {
    path: 'courses',
    select: 'title -bootcamp'
};

router.use('/:bootcampId/courses', courseRouter)

router.route('/')
    .get(advanceFiltering(BootcampModel, populateParams), getAllBootCamps)
    .post(protectRoute, grantAccessToRoles('publisher', 'admin'), creatBootCamp)

router.route('/:id')
    .get(getBootcampById)
    .delete(protectRoute, grantAccessToRoles('publisher', 'admin'), deleteBootCamp)
    .put(protectRoute, grantAccessToRoles('publisher', 'admin'), updateBootCamp)
    .patch(protectRoute, grantAccessToRoles('publisher', 'admin'), modifyBootCamp)

router.route('/:id/photo')
    .put(protectRoute, grantAccessToRoles('publisher', 'admin'), uploadBootcampPhoto);

module.exports = router;
