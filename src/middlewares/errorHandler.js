const ErrorResponse = require('../utils/ErrorResponse');

module.exports = (err, req, res, next) => {
    let message = ''
    let error = {...err};

    switch (err.name) {
        case 'CastError':
            message = `Error! Bootcamp with id ${error.value} doesn't exists!`;

            error = new ErrorResponse(message, 404)
            break;
        case 'MongoError':
            // MongoDB - Duplicate value
            if(error.code === 11000) message = 'Error! Trying to enter duplicate field!';

            error = new ErrorResponse(message, 400);
            break;
        case 'ValidationError':
            message = Object.values(error.errors).map(err => err.message)
            error = new ErrorResponse(message, 400);
            break;
    }

    res.status(error.statusCode || 500)
    res.json({
        success: false,
        error: [{ msg: error.message || 'Server error!' }]
    })
}
