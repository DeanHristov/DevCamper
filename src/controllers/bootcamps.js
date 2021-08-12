const BootcampModule = require('../models/Bootcamps');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc:   Get all bootcamps
// @route:  {GET} /api/v1/bootcamps
// @access: Public
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
    const bootcampArray = await BootcampModule.find();
    res.status(200);
    res.json({
        success: true,
        size: bootcampArray.length,
        data: bootcampArray
    })
});

// @desc:   Get single bootcamp
// @route:  {GET} /api/v1/bootcamps/:id
// @access: Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findById(req.params.id)
    res.status(200)
    res.json({
        success: true,
        data: [bootcamp]
    })
})

// @desc:   Create a new bootcamp
// @route:  {POST} /api/v1/bootcamps/
// @access: Private
exports.creatBootCamp = asyncHandler(async (req, res, next) => {
    const newBootcamp = await BootcampModule.create(req.body);

    console.log(req.body);
    res.status(201);
    res.json({
        success: true,
        data: [newBootcamp]
    });
})

// @desc:   Removing existing bootcamp
// @route:  {DELETE} /api/v1/bootcamps/:id
// @access: Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
    }

    res.status(200);
    return res.json({
        success: true,
        data: [bootcamp]
    });
})


// @desc:   Updating existing bootcamp
// @route:  {PUT} /api/v1/bootcamps/:id
// @access: Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
    res.status(200);
    return res.json({
        success: false,
        data: [{msg: 'This method is not implement yet'}]
    });
})

// @desc:   Modify specific field from existing bootcamp
// @route:  {PATCH} /api/v1/bootcamps/:id
// @access: Private
exports.modifyBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findByIdAndUpdate(req.params['id'], req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
    }

    res.status(200);
    return res.json({
        success: true,
        data: [bootcamp]
    });
});
