const UserModule = require('../models/Users');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc:   Creating a new user
// @route:  {POST} /api/v1/auth/register
// @access: Public
exports.registerNewUser = asyncHandler(async (req, res, next) => {
    res.status(200)
        .json({
            success: true
        })
});
