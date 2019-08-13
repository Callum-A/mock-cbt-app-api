const router = require("express").Router();
const verify = require("../util/verifyToken");
const User = require("../model/User");
const { Thought } = require("../model/Thought");
const makeResponse = require("../util/makeResponse");

/**
 * @route GET /api/profiles/getProfiles/myProfile
 * @description Gets the profile for the currently logged in user
 * @access Private
 */
router.get("/getProfiles/myProfile", verify, async (req, res) => {
    const user = await User.findById(req.user._id, "_id name email dateCreated");
    if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
    const thoughts = await Thought.find({user: req.user._id}, "feeling cause reasons justified dateCreated");
    return makeResponse(res, req, {user, thoughts}, 200);
});

/**
 * @route GET /api/profiles/getProfiles/:userId
 * @description Gets the profile for the user with the matching ID
 * @access Private
 */
router.get("/getProfiles/:userId", verify, (req, res) => {
    User.findById(req.params.userId, "_id name dateCreated", (err, user) => {
        if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {user}, 200);
    });
});

module.exports = router;