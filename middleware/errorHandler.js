const constants = {
    VALIDATION_ERROR : 400,
    UNAUTHORIZED : 401,
    NOT_FOUND : 404,
    FORBIDEN : 403,
    SERVER_ERROR : 500
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({title: "Validation error", message: err.message});
            
            break;

        case constants.NOT_FOUND:
            res.json({title: "not found error", message: err.message});
            break;

        case constants.UNAUTHORIZED:
            res.json({title: "UNAUTHORIZED error", message: err.message, stackTraces: err.stack});
            break;

        case constants.FORBIDEN:
            res.json({title: "FORBIDEN error", message: err.message});
            break;

        case constants.SERVER_ERROR:
            res.json({title: "SERVER error", message: err.message});
            break;

        default:
            res.json({message: "No error"})
            
            break;
    }
};

module.exports = errorHandler;