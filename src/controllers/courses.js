const CourseModule = require('../models/Courses');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isNotNull, isNull} = require('../utils/Utils')
const BootcampModule = require("../models/Bootcamps");
const {USER_ROLES} = require("../commons/constants");

// @desc:   Get all courses
// @route:  {GET} /api/v1/courses
// @route:  {GET} /api/v1/bootcamps/:bootcampId/courses
// @access: Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;

    if (isNotNull(bootcampId)) {
        const coursesArray = await CourseModule.find({ bootcamp: bootcampId })
        return res.status(200)
            .json({
                success: true,
                size: coursesArray.length,
                data: coursesArray,
            });
    }

    res.status(200).json(res.advanceFiltering)
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
    const { user } = req;

    req.body.user = user.id;

    if (isNull(bootcamp)) {
        return next(new ErrorResponse(`Error! The bootcamp with id: ${bootcampId} doesn't exists!`))
    }

    // Check if the user is owner of the bootcamp
    if (bootcamp.user.toString() !== user.id && user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! This user is not authorize to add this course`, 401));
    }

    const newCourse = await CourseModule.create(req.body);

    res.status(200)
        .json({
            success: true,
            data: [newCourse],
        });
});

// @desc:   Removing single course
// @route:  {DELETE} /api/v1/courses/:courseId
// @access: Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModule.findById(courseId)
    const { user } = req;

    if (isNull(course)) {
        return next(new ErrorResponse(`Error! Course with id ${req.params.id} doesn't exists!`, 400));
    }

    // Check if the user is owner of the course
    if (course.user.toString() !== user.id && user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! This user is not authorize to modify this course`, 401));
    }

    await CourseModule.findOneAndDelete({ _id: course._id });

    res.status(200);
    return res.json({
        success: true,
        data: []
    });
});

// @desc:   Removing single course
// @route:  {PUT} /api/v1/courses/:courseId
// @access: Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const course = await CourseModule.findById(courseId);
    const { user } = req;

    if (isNull(course)) {
        return next(new ErrorResponse(`Error! Course with id ${req.params.id} doesn't exists!`, 400));
    }

    // Check if the user is owner of the course
    if (course.user.toString() !== user.id && user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! This user is not authorize to modify this course`, 401));
    }

    await CourseModule.findByIdAndUpdate(courseId, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200);
    return res.json({
        success: true,
        data: [course]
    });
});
