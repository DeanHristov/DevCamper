const CourseModule = require('../models/Courses');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isNotNull, isNull} = require('../utils/Utils')
const BootcampModule = require("../models/Bootcamps");

// @desc:   Get all courses
// @route:  {GET} /api/v1/courses
// @route:  {GET} /api/v1/bootcamps/:bootcampId/courses
// @access: Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;
    let querySelector = null;

    if (isNotNull(bootcampId)) {
        querySelector = CourseModule.find({ bootcamp: bootcampId })
    } else {
        querySelector = CourseModule.find().populate({
            path: 'bootcamps',
            select: 'name description'
        });
    }

    const coursesArray = await querySelector;

    res.status(200)
        .json({
            success: true,
            size: coursesArray.length,
            data: coursesArray,
        });
});


// @desc:   Get single course
// @route:  {GET} /api/v1/courses/:courseId
// @access: Public
exports.getCourseById = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModule.findById(courseId).populate({
      path: 'bootcamp',
      select: '-_id name description phone website'
    });

    if(isNull(course)) {
        return next(new ErrorResponse(`The course with id: ${courseId} doesn't exists`, 404))
    }

    res.status(200)
        .json({
            success: true,
            size: 1,
            data: course,
        });
});


// @desc:   Create a new course
// @route:  {POST} {GET} /api/v1/bootcamps/:bootcampId/courses
// @access: Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;
    const bootcamp = await BootcampModule.findById(bootcampId)


    if (isNull(bootcamp)) {
        return next(new ErrorResponse(`Error! The bootcamp with id: ${bootcampId} doesn't exists!`))
    }

    const newCourse = CourseModule.create(req.body);

    res.status(200)
        .json({
            success: true,
            data: newCourse,
        });
});

// @desc:   Removing single course
// @route:  {DELETE} /api/v1/courses/:courseId
// @access: Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModule.findByIdAndDelete(courseId)

    if (isNull(course)) {
        return next(new ErrorResponse(`Error! Course with id ${req.params.id} doesn't exists!`, 400));
    }

    res.status(200);
    return res.json({
        success: true,
        data: [course]
    });
});

// @desc:   Removing single course
// @route:  {PUT} /api/v1/courses/:courseId
// @access: Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModule.findByIdAndUpdate(courseId, req.body, {
        new: true,
        runValidators: true,
    });

    if (isNull(course)) {
        return next(new ErrorResponse(`Error! Course with id ${req.params.id} doesn't exists!`, 400));
    }

    res.status(200);
    return res.json({
        success: true,
        data: [course]
    });
});
