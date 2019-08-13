const makeResponse = require("./makeResponse");
/**
 * Checks if the user appended to the request is an admin
 * @param {*} req The request made
 * @param {*} res The response
 * @param {*} next The next function to be called
 */
module.exports = function (req, res, next) {
    if(req.user.admin) {
        next();
    } else {
        return makeResponse(res, {message: "Unauthorized access."}, 401);
    }
};