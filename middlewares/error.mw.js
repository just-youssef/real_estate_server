const ErrorMW = (err, req, res, nxt) => {
    // if (err.errors) {
    //     for (let e in err.errors) {
    //         const statusCode = err.statusCode;
    //         const message = err.message;

    //         console.log(err.errors[e].message);
    //         return res.status(statusCode).json({
    //             success: false,
    //             statusCode,
    //             message
    //         });
    //     }
    // }

    if (err.errors) {
        console.log('err.errors founded');
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'internal server error';
    const response = {
        success: false,
        statusCode,
        message
    }
    console.log(response);

    return res.status(statusCode).json(response);
}

export default ErrorMW;