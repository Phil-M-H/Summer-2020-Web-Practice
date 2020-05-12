module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (!err) {
        return res.status(404).json({message: "You've attempted to go to an invalid page"});
    }
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {

        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token'});
    }

    // default to 500 server error
    console.log("Error:", err);
    return res.status(500).json({ message: err.message });
}
