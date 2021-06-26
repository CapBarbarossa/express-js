const AppError = require('../utils/app-error');

const handleCaseErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue.name;
    // .match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field value ${value}, please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.properties.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const sendErrorforProd = (err, res) => {
    // Operational Eror, trusted error: Send message to client.
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        // Programming or other unknown error, don't leak error details.
    } else {
        // 1) Log Error
        // eslint-disable-next-line no-console
        console.error('Error 🔥', err);

        // 2) Send Generic message
        res.status(500).json({
            status: 'ERROR 🔥',
            message: 'Something went wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        let error = { ...err };

        if (error.name === 'CastError') error = handleCaseErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error._message === 'Tour validation failed')
            error = handleValidationErrorDB(error);

        sendErrorforProd(error, res);
    }

    next();
};
