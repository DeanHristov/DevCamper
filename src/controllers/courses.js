const CourseModule = require('../models/Courses');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isNotNull } = require('../utils/Utils')

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
        querySelector = CourseModule.find();
    }

    const coursesArray = await querySelector;

    res.status(200)
        .json({
            success: true,
            size: coursesArray.length,
            data: coursesArray,
        })
})
