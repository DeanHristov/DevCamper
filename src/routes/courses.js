const express = require('express');
const router = express.Router({
    mergeParams: true
});

const { protectRoute, grantAccessToRoles } = require('../middlewares/auth')
const advanceFiltering = require('../middlewares/advanceFiltering');
const CourseModel = require('../models/Courses');
const {USER_ROLES} = require("../commons/constants");
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
    .post(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), createCourse)

router.route('/:courseId')
    .get(getCourseById)
    .delete(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), deleteCourse)
    .put(protectRoute, grantAccessToRoles(USER_ROLES.PUBLISHER, USER_ROLES.ADMIN), updateCourse)

module.exports = router;
