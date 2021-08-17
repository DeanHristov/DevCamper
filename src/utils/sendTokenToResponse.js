const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env;

function sendTokenToResponse(model, statusCode, res) {
    const token = model.getJWTToken();
    const timeInDays = Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        expires: new Date(timeInDays),
        httpOnly: true,
        secure: NODE_ENV === 'production'
    }

    res.status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({ success: true, token })
}

module.exports = sendTokenToResponse;
