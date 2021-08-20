const { isNotNull } = require('../utils/Utils');

// @desc: This middleware is responsible to give of each route common functionality
// like pagination, sorting, filtering
const advanceFiltering = ($model, populate) => async (req, res, next) => {
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
    // Example: averageCost[gte]=1000 =>  { "query": { "averageCost": { "$gte": "1000" } } }

    // @see: https://docs.mongodb.com/manual/reference/operator/query/
    // @see: https://mongoosejs.com/docs/tutorials/query_casting.html
    const queryParams = JSON.parse(
        queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    )
    let querySelect = $model.find(queryParams);

    // Including populate
    // @see: https://mongoosejs.com/docs/populate.html#populate-virtuals
    if (isNotNull(populate)) querySelect.populate(populate)

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
    const pagination = {};
    const total = await $model.countDocuments();

    if (endIdx < total) {
        pagination.next = { page: page + 1}
        pagination.limit = limit
    }

    if (startIdx > 0) {
        pagination.prev = { page: page - 1}
        pagination.limit = limit
    }

    querySelect = querySelect.skip(startIdx).limit(limit)

    const queryResult = await querySelect;

    res.advanceFiltering = {
        success: true,
        pagination,
        size: queryResult.length,
        query: queryParams,
        data: queryResult,
    }

    next();
}


module.exports = advanceFiltering;
