const express = require('express');
const router = express.Router({
    mergeParams: true
});

const { protectRoute } = require('../middlewares/auth')
const advanceFiltering = require('../middlewares/advanceFiltering');
const CourseModel = require('../models/Courses');
const populateParams = {
    path: 'bootcamp',
    select: 'name description'
};

const {
    getCourses, getCourseById, createCourse,
    deleteCourse, updateCourse
} = require('../controllers/courses');

router.route('/')
    .get(advanceFiltering(CourseModel, populateParams), getCourses)
    .post(protectRoute, createCourse)

router.route('/:courseId')
    .get(getCourseById)
    .delete(protectRoute, deleteCourse)
    .put(protectRoute, updateCourse)

module.exports = router;
