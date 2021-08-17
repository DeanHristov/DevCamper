const UserModule = require('../models/Users');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');
const {isNull} = require("../utils/Utils");

// @desc:   Creating a new user
// @route:  {POST} /api/v1/auth/register
// @access: Public
exports.registerNewUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const newUser = await UserModule.create({
        name, email, password, role
    });

    // Create new token:
    const token = newUser.getJWTToken();
    res.status(200)
        .json({
            success: true,
            data: [{ token }]
        })
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

    res.status(200)
        .json({
            success: true,
            data: [{
                token: user.getJWTToken()
            }]
        })
});
