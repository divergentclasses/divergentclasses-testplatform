const jwt = require('jsonwebtoken')
const COOKIE_NAME = process.env.COOKIE_NAME;


const verifyToken = async (req, res, next) => {

    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token Not Received" })
    }
    return new Promise((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                reject(err.message);
                return res.status(401).json({ message: "Token Expired" })
            } else {
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        })
    })
}

module.exports = { verifyToken }