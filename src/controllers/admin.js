const UserModule = require('../models/Users');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const {isNull} = require("../utils/Utils");
const sendTokenToResponse = require("../utils/sendTokenToResponse");

// @desc:   Fetch all users
// @route:  {GET} /api/v1/auth/users
// @access: PRIVATE/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200)
        .json(res.advanceFiltering)
});

// @desc:   Get single user
// @route:  {GET} /api/v1/auth/users/:userId
// @access: PRIVATE/Admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await UserModule.findById(userId);

    if (isNull(user)) {
        return next(new ErrorResponse('Error! The user doesn\'t exists', 401))
    }

    res.status(200).json({ success: true, data: [user]});
});

// @desc:   Create a new user
// @route:  {POST} /api/v1/auth/users
// @access: PRIVATE/Admin
exports.createNewUser = asyncHandler(async (req, res, next) => {
    const user = await UserModule.create(req.body)

    res.status(201).json({ success: true, data: [user]});
});

// @desc:   Update existing user
// @route:  {PUT} /api/v1/auth/users/:userId
// @access: PRIVATE/Admin
exports.modifyExistingUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await UserModule.findByIdAndUpdate(userId, req.body, {
        runValidators: true,
        new: true
    });

    res.status(200).json({ success: true, data: [user]});
});

// @desc:   Delete user
// @route:  {DELETE} /api/v1/auth/users/:userId
// @access: PRIVATE/Admin
exports.deleteExistingUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    await UserModule.findByIdAndDelete(userId);

    res.status(200).json({ success: true, data: [{ msg: 'The user have been removed successfully' }]});
});
