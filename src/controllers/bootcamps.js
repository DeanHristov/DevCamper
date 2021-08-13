const BootcampModule = require('../models/Bootcamps');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc:   Get all bootcamps
// @route:  {GET} /api/v1/bootcamps
// @access: Public

// @see: https://docs.mongodb.com/manual/reference/operator/query/
// @see: https://mongoosejs.com/docs/tutorials/query_casting.html
// TODO Code-refactor because the code below potentially will be duplicate code of other resources
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
    let queryString = null;
    const { query } = req;
    const requestQuery = { ...query }
    const removeFields = [
        'selectBy', 'sortBy',
        'page', 'limit'
    ];

    // Removing fields from the query params
    for (let value of removeFields) delete requestQuery[value]

    queryString = JSON.stringify(requestQuery);

    // Parsing query params as a query language in MongoDB
    // Example params:  { "query": { "averageCost": { "$gte": "1000" } } }
    const queryParams = JSON.parse(
        queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    )

    let querySelect = BootcampModule.find(queryParams)

    // Selecting data by particular fields
    if (query.hasOwnProperty('selectBy')) {
        const fields = query.selectBy.split(',').join(' ')
        querySelect = querySelect.select(fields)
    }

    // Sort data by particular fields
    if (query.hasOwnProperty('sortBy')) {
        const sortBy = query.sortBy.split(',').join(' ')
        querySelect = querySelect.sort(sortBy)
    } else {
        querySelect = querySelect.sort('-createdAt')
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const startIdx = (page - 1) * limit
    const endIdx = page * limit;
    const pagination = null;
    const total = await BootcampModule.countDocuments();

    if (endIdx < total) {
        pagination.next = { page: page + 1}
        pagination.limit = limit
    }

    if (startIdx > 0) {
        pagination.prev = { page: page - 1}
        pagination.limit = limit
    }

    querySelect = querySelect.skip(startIdx).limit(limit)

    const bootcampArray = await querySelect;
    res.status(200);
    res.json({
        success: true,
        pagination,
        size: bootcampArray.length,
        query: queryParams,
        data: bootcampArray,
    })
});

// @desc:   Get single bootcamp
// @route:  {GET} /api/v1/bootcamps/:id
// @access: Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findById(req.params.id)

    res.status(200)
    res.json({
        success: true,
        data: [bootcamp],
    })
})

// @desc:   Create a new bootcamp
// @route:  {POST} /api/v1/bootcamps/
// @access: Private
exports.creatBootCamp = asyncHandler(async (req, res, next) => {
    const newBootcamp = await BootcampModule.create(req.body);

    res.status(201);
    res.json({
        success: true,
        data: [newBootcamp]
    });
})

// @desc:   Removing existing bootcamp
// @route:  {DELETE} /api/v1/bootcamps/:id
// @access: Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await BootcampModule.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Error! Bootcamp with id ${req.params.id} doesn't exists!`, 400));
    }

    res.status(200);
    return res.json({
        success: true,
        data: [bootcamp]
    });
})


// @desc:   Updating existing bootcamp
// @route:  {PUT} /api/v1/bootcamps/:id
// @access: Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
    res.status(200);
    return res.json({
        success: false,
        data: [{msg: 'This method is not implement yet'}]
    });
})

// @desc:   Modify specific field from existing bootcamp
// @route:  {PATCH} /api/v1/bootcamps/:id
// @access: Private
exports.modifyBootCamp = asyncHandler(async (req, res, next) => {
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
});
