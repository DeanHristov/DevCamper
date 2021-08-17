const path = require('path');

const BootcampModule = require('../models/Bootcamps');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc:   Get all bootcamps
// @route:  {GET} /api/v1/bootcamps
// @access: Public
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
    res.status(200);
    res.json(res.advanceFiltering)
});

// @desc:   Get single bootcamp
// @route:  {GET} /api/v1/bootcamps/:id
// @access: Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findById(req.params.id).populate({
        path: 'courses',
        select: 'title -bootcamp'
    })

    res.status(200)
    res.json({
        success: true,
        data: [bootcamp],
    })
})

// @desc:   Create a new bootcamp
// @route:  {POST} /api/v1/bootcamps/
// @access: Private
exports.creatBootCamp = asyncHandler(async (req, res, next) => {
    const newBootcamp = await BootcampModule.create(req.body);

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
    const bootcamp = await BootcampModule.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
    }
    bootcamp.remove();
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

// @desc:   Upload bootcamp photo
// @route:  {PUT} /api/v1/bootcamps/:id/photo
// @access: Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
    const { FILE_UPLOAD_PATH, FILE_UPLOAD_MAX_LIMIT_SIZE } = process.env;
    const { id } = req.params;
    const bootcamp = await BootcampModule.findById(id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${id} doesn't exists!`, 400));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Error! Missing file!`, 400));
    }

    const file = req.files['file\n'];

    //Validate the input file
    if (!file.mimetype.startsWith('image/jpeg') || file.size > FILE_UPLOAD_MAX_LIMIT_SIZE) {
        // @see: https://stackoverflow.com/questions /30114881/how-does-this-equal-10mb
        const maxSize = FILE_UPLOAD_MAX_LIMIT_SIZE / 1024 / 1024;
        return next(new ErrorResponse(
            `Error! Please, File type or size is incorrect! API support types: 'image/jpeg', max size: ${maxSize}MB`, 400
        ));
    }

    // Create and save the file
    file.name = `${new Date().getTime()}_${bootcamp._id}${path.parse(file.name).ext}`
    file.mv(`${FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) return next(new ErrorResponse(`Error! A error occur on uploading process!`, 500));

        await BootcampModule.findByIdAndUpdate(id, {photo: file.name })
        res.status(200).json({
            success: true,
            data: [{ msg: `The file ${file.name} was attached successfully` }]
        })
    })
})
