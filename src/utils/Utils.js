exports.isNull = (value) => {
    return value === null || value === undefined;
}

exports.isNotNull = (value) => {
    return value !== null && value !== undefined;
}
