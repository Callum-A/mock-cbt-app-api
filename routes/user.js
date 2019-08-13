const router = require("express").Router();
const User = require("../model/User");
const verify = require("../util/verifyToken");
const isAdmin = require("../util/isAdmin");
const makeResponse = require("../util/makeResponse");

/**
 * @route GET /api/users/getUsers
 * @description Gets all users currently registered
 * @access Private (Admin)
 */
router.get("/getUsers", verify, isAdmin, (req, res) => {
    User.find({}, "_id name email admin", (err, users) => {
        if (!users) return makeResponse(res, req, {message: "Users not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {users}, 200);
    });
});
/**
 * @route GET /api/users/getUsers/:userId
 * @description Gets the specified user with the matching ID
 * @access Private (Admin)
 */
router.get("/getUsers/:userId", verify, isAdmin, (req, res) => {
    User.findById(req.params.userId, "_id name email admin", (err, user) => {
        if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {user}, 200);
    });
});
/**
 * @route DELETE /api/users/deleteUsers/:userID
 * @description Deletes the user with the matching ID
 * @access Private (Admin)
 */
router.delete("/deleteUsers/:userId", verify, isAdmin, (req, res) => {
    User.findByIdAndDelete(req.params.userId, (err, user) => {
        if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "User " + user._id + " deleted successfully."}, 200);
    });
});
/**
 * @route DELETE /api/users/deleteUsers
 * @description Deletes the user that is currently logged in
 * @access Private
 */
router.delete("/deleteUsers", verify, (req, res) => {
    User.findByIdAndDelete(req.user._id, (err, user) => {
        if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "User " + user._id + " deleted successfully."}, 200);
    });
});
/**
 * @route PUT /api/users/updateName
 * @description Updates the name for the user that is currently logged in
 * @access Private
 */
router.put("/updateName", verify, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {name: req.body.name}, (err, user) => {
        if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "Changed name for user " + user._id + " successfully."}, 200);
    });
});

module.exports = router;