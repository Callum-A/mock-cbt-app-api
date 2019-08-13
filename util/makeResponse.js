/** 
 * Makes a response to the user with given parameters
 * @param {*} res The response to be made
 * @param {*} body The body of the response to be returned
 * @param {*} status The status code of the response
*/
module.exports = makeResponse = (res, req, body, status) => {
    console.log(req.method + " " + req.originalUrl + " " + status);
    return res.header("Content-Type", "application/json").status(status).send(body);
};