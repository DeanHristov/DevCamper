const express = require('express');
const router = express.Router({
    mergeParams: true
});

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
    .post(createCourse)

router.route('/:courseId')
    .get(getCourseById)
    .delete(deleteCourse)
    .put(updateCourse)

module.exports = router;
