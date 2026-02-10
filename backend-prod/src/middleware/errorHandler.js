/**
 * Global error handler middleware
 * Prevents internal error details from leaking to client
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    // Never log or expose credentials
    const safeError = {
        success: false,
        error: err.message || 'An unexpected error occurred',
    };

    // Don't expose stack traces in production
    if (process.env.NODE_ENV === 'development') {
        safeError.stack = err.stack;
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(safeError);
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
};
