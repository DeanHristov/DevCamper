const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (err, req, res, next) => {
    let error = {...err};

    switch (err.name) {
        case 'CastError':
            const message = `Error! Bootcamp with id ${error.value} doesn't exists!`;

            error = new ErrorResponse(message, 404)
            break;
    }

    res.status(error.statusCode || 500)
    res.json({
        success: false,
        error: [{ msg: error.message || 'Server error!' }]
    })
}
