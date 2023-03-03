const AppError = require('./../utils/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        error: err,
        status: err.status,
        message: err.message,
        stack: err.stack,

    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error(err);

        res.status(500).json({
            status: 'Error',
            message: 'somthing went Wrong'
        });
    };
};

const castErrorHandler = err => {
    const message = `Invalid ${err.path}:${err.value}. `;
    return new AppError(message, 400);
};

const duplicateErrorHandler = err => {
    console.log(err);
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `duplicates field values: ${value}. Please provide another value `;
    return new AppError(message, 400);
};

const validatorErrorHandler = err => {
    const error = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input Data. ${error.join('. ')}`;

    return new AppError(message, 400);
}



const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {

        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        const error = { ...err };
        if (error.name = 'CastError') error = castErrorHandler(error);

        if (error.code = 11000) error = duplicateErrorHandler(error);

        if (error.name = 'validatorError') error = validatorErrorHandler(error);

        sendErrorProd(error, res);
    }

}




module.exports = globalErrorHandler;