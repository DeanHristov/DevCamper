const ReviewModule = require('../models/Review');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { isNotNull, isNull} = require('../utils/Utils')
const BootcampModule = require("../models/Bootcamps");
const {USER_ROLES} = require("../commons/constants");

// @desc:   Get all reviews
// @route:  {GET} /api/v1/reviews
// @route:  {GET} /api/v1/bootcamps/:bootcampId/reviews
// @access: Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;

    if (isNotNull(bootcampId)) {
        const reviews = await ReviewModule.find({ bootcamp: bootcampId })
        return res.status(200)
            .json({ success: true, size: reviews.length, data: reviews });
    }

    res.status(200).json(res.advanceFiltering)
});

// @desc:   Get a single review
// @route:  {GET} /api/v1/reviews/:reviewId
// @access: Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await ReviewModule.findById(reviewId).populate({
        path: 'bootcamps',
        select: 'name description'
    })

    if (isNull(review)) {
       return next(new ErrorResponse(`Error! Review with this id "${reviewId}" doesn't exists!`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc:   Create a new review
// @route:  {POST} /api/v1/bootcamps/:bootcampId/reviews
// @access: PRIVATE
exports.createReview = asyncHandler(async (req, res, next) => {
    const { bootcampId } = req.params;

    req.body.bootcamp = bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await BootcampModule.findById(bootcampId)

    if (isNull(bootcamp)) {
        return next(new ErrorResponse(`Error! Bootcamp with this id "${bootcampId}" doesn't exists!`, 404))
    }

    const newReview = await ReviewModule.create(req.body);
    res.status(200).json({
        success: true,
        data: [newReview]
    });
});

// @desc:   Modify existing review
// @route:  {PUT} /api/v1/reviews/:reviewId
// @access: PRIVATE
exports.modifyReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    let review = await ReviewModule.findById(reviewId)

    if (isNull(review)) {
        return next(new ErrorResponse(`Error! Review with this id "${reviewId}" doesn't exists!`, 404))
    }

    const isNotOwner = review.user.toString() !== req.user.id;
    if (isNotOwner && req.user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! You are not authorize to make this acton`, 404))
    }

    review = await ReviewModule.findByIdAndUpdate(reviewId, req.body, {
        runValidators: true,
        new: true
    });

    res.status(200).json({
        success: true,
        data: [review]
    });
});

// @desc:   Create a new review
// @route:  {DELETE} /api/v1/reviews/:reviewId
// @access: PRIVATE
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await ReviewModule.findById(reviewId)

    if (isNull(review)) {
        return next(new ErrorResponse(`Error! Review with this id "${reviewId}" doesn't exists!`, 404))
    }

    const isNotOwner = review.user.toString() !== req.user.id;
    if (isNotOwner && req.user.role !== USER_ROLES.ADMIN) {
        return next(new ErrorResponse(`Error! You are not authorize to make this acton`, 404))
    }

    await review.remove();

    res.status(200).json({
        success: true,
        data: [{ msg: `The review with id: ${reviewId} was removed!` }]
    });
});
