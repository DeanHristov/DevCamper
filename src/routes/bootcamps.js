const express = require('express');
const router = express.Router();
const {
    getAllBootCamps, getBootcampById, creatBootCamp,
    deleteBootCamp, updateBootCamp, modifyBootCamp
} = require('../controllers/bootcamps');

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
    .post(creatBootCamp)

router.route('/:id')
    .get(getBootcampById)
    .delete(deleteBootCamp)
    .put(updateBootCamp)
    .patch(modifyBootCamp)

module.exports = router;
