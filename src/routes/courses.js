const express = require('express');
const router = express.Router({
    mergeParams: true
});
const {
    getCourses, getCourseById, createCourse,
    deleteCourse, updateCourse
} = require('../controllers/courses');

router.route('/')
    .get(getCourses)
    .post(createCourse)

router.route('/:courseId')
    .get(getCourseById)
    .delete(deleteCourse)
    .put(updateCourse)

module.exports = router;
