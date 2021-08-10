// @desc:   Get all bootcamps
// @route:  {GET} /api/v1/bootcamps
// @access: Public
exports.getAllBootCamps = (req, res, next) => {
    res.status(200);
    res.json({
        success: true,
        data: [{ msg: 'Get all bootcamps' }]
    });
}

// @desc:   Get single bootcamp
// @route:  {GET} /api/v1/bootcamps/:id
// @access: Public
exports.getBootCamp = (req, res, next) => {
    res.status(200);
    res.json({
        success: true,
        data: [{ msg: `Get single bootcamp with id: ${req.params['id']}` }]
    });
}

// @desc:   Create a new bootcamp
// @route:  {POST} /api/v1/bootcamps/
// @access: Private
exports.creatBootCamp = (req, res, next) => {
    res.status(200);
    res.json({
        success: true,
        data: [{ msg: `Create a new bootcamp` }]
    });
}

// @desc:   Removing existing bootcamp
// @route:  {DELETE} /api/v1/bootcamps/:id
// @access: Private
exports.deleteBootCamp = (req, res, next) => {
    res.status(200);
    res.json({
        success: true,
        data: [{ msg: `Removing existing bootcamp with id: ${req.params['id']}` }]
    });
}

// @desc:   Updating existing bootcamp
// @route:  {PUT} /api/v1/bootcamps/:id
// @access: Private
exports.updateBootCamp = (req, res, next) => {
    res.status(200);
    res.json({
        success: true,
        data: [{ msg: `Updating existing bootcamp with id: ${req.params['id']}` }]
    });
}

// @desc:   Modify specific field from existing bootcamp
// @route:  {PATCH} /api/v1/bootcamps/:id
// @access: Private
exports.modifyBootCamp = (req, res, next) => {
    res.status(200);
    res.json({
        success: true,
        data: [{ msg: `Modify specific field from existing bootcamp with id: ${req.params['id']}` }]
    });
}
