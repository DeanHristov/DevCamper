const crypto = require('crypto')

const UserModule = require('../models/Users');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const {isNull} = require("../utils/Utils");
const sendTokenToResponse  = require('../utils/sendTokenToResponse');
const sendEmail = require('../utils/sendEmail');

// @desc:   Creating a new user
// @route:  {POST} /api/v1/auth/register
// @access: Public
exports.registerNewUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const newUser = await UserModule.create({
        name, email, password, role
    });

    sendTokenToResponse(newUser, 200, res);
});

// @desc:   Login with existing user
// @route:  {POST} /api/v1/auth/signIn
// @access: Public
exports.signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate the email & password
    if (isNull(email) || isNull(password)) {
        return next(new ErrorResponse('Error! The email or password are incorrect!', 400))
    }

    // Check if the user exists
    const user = await UserModule.findOne({ email }).select('+password');
    const invalidCredesMsg = new ErrorResponse('Error! Invalid credentials!', 401);

    if (isNull(user)) return next(invalidCredesMsg)

    // Check the passwords
    const isPassMatched = await user.isMatchedPasswords(password)

    if (!isPassMatched)  return next(invalidCredesMsg)

    sendTokenToResponse(user, 200, res);
});

// @desc:  Log out / clear the cookie
// @route:  {GET} /api/v1/auth/signOut
// @access: Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000)
    })
    res.status(200).json({ success: true, data: [] })
});

// @desc:   Get current logged user
// @route:  {GET} /api/v1/auth/me
// @access: Private
exports.getMyself = asyncHandler(async (req, res, next) => {
    const currUser = await UserModule.findById(req.user.id)

    res.status(200).json({ success: true, data: [currUser] })
});

// @desc:   Updated the user details (name and email)
// @route:  {PUT} /api/v1/auth/update-users
// @access: Private
exports.modifyUser = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body
    const { id } = req.user
    const options = { new: true, runValidators: true }
    const selectedUser = await UserModule.findByIdAndUpdate(id, { name, email }, options);

    res.status(200)
        .json({
            success: true,
            data: [selectedUser]
        })
});

// @desc:   Modify the user password
// @route:  {PUT} /api/v1/auth/change-password
// @access: Private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
    const {currentPassword, newPassword} = req.body;
    const user = await UserModule.findById(req.user.id).select('+password')

    if (!(await user.isMatchedPasswords(currentPassword))) {
        return next(new ErrorResponse('Error! The password doesn\'t match!', 401))
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    sendTokenToResponse(user, 200, res);
});

// @desc:   Forgot password
// @route:  {POST} /api/v1/auth/forgot-password
// @access: public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const currUser = await UserModule.findOne({ email: req.body.email })

    if (isNull(currUser)) {
        return next(new ErrorResponse('Error! There is no user with this email!', 404))
    }

    const resetToken = currUser.getResetToken();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`
    const msg = `You are receiving this email because we accept request for password reset.
    Please make PUT request to:\n\n\n ${resetUrl}`

    try {
        await sendEmail({
            email: currUser.email,
            message: msg,
            subject: 'Reset password'
        });
    } catch (reason) {
        currUser.resetPasswordToken = undefined;
        currUser.resetPasswordExpire = undefined;
        return next(new ErrorResponse('Error! An email could not be sent', 500))
    }

    await currUser.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: [{ msg: 'Reset link was send...' }]})
});

// @desc:   Reset user password
// @route:  {PUT} /api/v1/auth/reset-password/:resetToken
// @access: Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    const resetPasswordToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const currUser = await UserModule.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (isNull(currUser)) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    currUser.password = newPassword;
    currUser.resetPasswordToken = undefined;
    currUser.resetPasswordExpire = undefined;

    await currUser.save();
    sendTokenToResponse(currUser, 200, res);
});
