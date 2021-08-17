const jwt = require('jsonwebtoken');
const colors = require('colors')

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const UserModule = require('../models/Users');
const { isNull } = require('../utils/Utils');
const { JWT_SECRET } = process.env;

exports.protectRoute = asyncHandler(async (req, res, next) => {
    let token = null // req.cookies.token ? req.cookies.token : null;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    if (isNull(token)) return next(new ErrorResponse("Error! You do not have access to this route", 401));

    try {
        const decode = jwt.verify(token, JWT_SECRET)
        req.user = await UserModule.findById(decode.id);

        next( )
    } catch (reason) {
        console.log(colors.bgRed(reason))
    }
})

exports.grantAccessToRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(
            `Error! The user's role (${req.user.role}) is not authorize to perform this action!`, 403)
        );
    }
    next();
}
