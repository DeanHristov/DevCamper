const express = require('express');

const router = express.Router();
const {
    getAllBootCamps, getBootcampById, creatBootCamp,
    deleteBootCamp, updateBootCamp, modifyBootCamp, uploadBootcampPhoto
} = require('../controllers/bootcamps');
const { protectRoute } = require('../middlewares/auth')
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
    .post(protectRoute, creatBootCamp)

router.route('/:id')
    .get(getBootcampById)
    .delete(protectRoute, deleteBootCamp)
    .put(protectRoute, updateBootCamp)
    .patch(protectRoute, modifyBootCamp)

router.route('/:id/photo')
    .put(uploadBootcampPhoto);

module.exports = router;
