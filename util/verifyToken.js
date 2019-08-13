const jwt = require("jsonwebtoken");
const RevokedToken = require("../model/RevokedToken");
const makeResponse = require("./makeResponse");

/**
 * Verifies a JWT and if it is valid appends the user to the request. Middleware function
 * @param {*} req The request made
 * @param {*} res The response made
 * @param {*} next The next function
 */
module.exports = async function (req, res, next) {
    const token = req.header("auth-token");
    const revokedToken = await RevokedToken.findOne({token});
    if (!token || revokedToken) return makeResponse(res, {message: "Access Denied."}, 401);
    try {
        //Check if the token is valid and add the user to the request
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return makeResponse(res, {message: "Invalid Token."}, 401);
    }
}