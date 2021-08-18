const path = require('path');

const BootcampModule = require('../models/Bootcamps');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const {isNotNull} = require("../utils/Utils");
const { USER_ROLES, MIME_TYPES } = require('../commons/constants')

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
    req.body.user = req.user.id;

    const publishedUser = await BootcampModule.findOne({ user: req.user.id });

    // Limit the publisher to create only one bootcamp
    if (isNotNull(publishedUser) && req.user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse('Error! The publisher can upload only one bootcamp!', 400))
    }

    const newBootcamp = await BootcampModule.create(req.body);

    res.status(201);
    res.json({ success: true, data: [newBootcamp] });
})

// @desc:   Removing existing bootcamp
// @route:  {DELETE} /api/v1/bootcamps/:id
// @access: Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
    }

    // Check if the user is owner of the bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! This user is not authorize to modify this bootcamp`, 401));
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
    return next(new ErrorResponse('Error! Method is not allowed', 405))
})

// @desc:   Modify specific field from existing bootcamp
// @route:  {PATCH} /api/v1/bootcamps/:id
// @access: Private
exports.modifyBootCamp = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let bootcamp = await BootcampModule.findById(id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${id} doesn't exists!`, 400));
    }

    // Check if the user is owner of the bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! This user is not authorize to modify this bootcamp`, 401));
    }

    bootcamp = await BootcampModule.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

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

    // Check if the user is owner of the bootcamp
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! This user is not authorize to modify this bootcamp`, 401));
    }

    const file = req.files['file'];

    //Validate the input file
    if (!file.mimetype.startsWith(MIME_TYPES.JPEG) || file.size > FILE_UPLOAD_MAX_LIMIT_SIZE) {
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
