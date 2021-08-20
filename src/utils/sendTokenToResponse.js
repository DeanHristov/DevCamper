const { JWT_COOKIE_EXPIRE, NODE_ENV } = process.env;

function sendTokenToResponse(model, statusCode, res) {
    const token = model.getJWToken();
    const timeInHours = Date.now() + parseInt(JWT_COOKIE_EXPIRE.split("")[0]) * 60 * 60 * 1000;
    const cookieOptions = {
        expires: new Date(timeInHours),
        httpOnly: true,
        secure: NODE_ENV === 'production'
    }

    res.status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({ success: true, token })
}

module.exports = sendTokenToResponse;
