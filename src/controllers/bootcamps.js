const BootcampModule = require('../models/Bootcamps');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc:   Get all bootcamps
// @route:  {GET} /api/v1/bootcamps
// @access: Public
exports.getAllBootCamps = async (req, res, next) => {
    try {
        const bootcampArray = await BootcampModule.find();
        res.status(200);
        res.json({
            success: true,
            size: bootcampArray.length,
            data: bootcampArray
        })
    } catch (reason) {
        next(reason);
    }
}

// @desc:   Get single bootcamp
// @route:  {GET} /api/v1/bootcamps/:id
// @access: Public
exports.getBootcampById = async (req, res, next) => {
    try {
        const bootcamp = await BootcampModule.findById(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: [bootcamp]
        })
    } catch (reason) {
       next(reason);
    }
}

// @desc:   Create a new bootcamp
// @route:  {POST} /api/v1/bootcamps/
// @access: Private
exports.creatBootCamp = async (req, res, next) => {
    try{
        const newBootcamp = await BootcampModule.create(req.body);

        console.log(req.body);
        res.status(201);
        res.json({
            success: true,
            data: [newBootcamp]
        });
    } catch (reason) {
        next(reason);
    }
}

// @desc:   Removing existing bootcamp
// @route:  {DELETE} /api/v1/bootcamps/:id
// @access: Private
exports.deleteBootCamp = async (req, res, next) => {
    try {
        const bootcamp = await BootcampModule.findByIdAndDelete(req.params.id)

        if (!bootcamp) {
            return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
        }

        res.status(200);
        return res.json({
            success: true,
            data: [bootcamp]
        });
    } catch (reason) {
        next(reason);
    }
}


// @desc:   Updating existing bootcamp
// @route:  {PUT} /api/v1/bootcamps/:id
// @access: Private
exports.updateBootCamp = async (req, res, next) => {

}

// @desc:   Modify specific field from existing bootcamp
// @route:  {PATCH} /api/v1/bootcamps/:id
// @access: Private
exports.modifyBootCamp = async (req, res, next) => {
    const bootcamp = await BootcampModule.findByIdAndUpdate(req.params['id'], req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
    }

    res.status(200);
    return res.json({
        success: true,
        data: [bootcamp]
    });
}
