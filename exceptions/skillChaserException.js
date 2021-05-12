module.exports = function generateServerErrorCode(res, code, fullError, msg, location = 'server') {
    const errors = {};
    errors[location] = {
        fullError,
        msg,
    };

    return res.status(code).json({
        code,
        fullError,
        errors,
    });
}