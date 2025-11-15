const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes on the server
    console.error(err.stack);

    // Use the status code from the error if it exists, otherwise default to 500
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message,
        // Only show the stack trace in development for security reasons
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { errorHandler };