const router = require("express").Router();
const { Thought, Reason } = require("../model/Thought");
const verify = require("../util/verifyToken");
const { thoughtValidation } = require("../util/validation");
const makeResponse = require("../util/makeResponse");

/**
 * @route POST /api/thoughts/createThought
 * @description Creates a thought if valid and adds it to the database
 * @access Private
 */
router.post("/createThought", verify, async (req, res) => {
    // Validate the thought and if there is an error send the message
    const { error } = thoughtValidation(req.body);
    if (error) return makeResponse(res, req, {message: error.details[0].message}, 400);
    // If it is valid create a new thought
    const thought = new Thought({
        feeling: req.body.feeling,
        cause: req.body.cause,
        justified: req.body.justified,
        user: req.user._id
    });
    // Save the thought and return the ID or return an error message
    try {
        const savedThought = await thought.save();
        return makeResponse(res, req, {message: "Saved thought " + savedThought._id + " successfully."}, 201);
    } catch(err) {
        return makeResponse(res, req, {message: "Internal server error."}, 500);
    }
});
/**
 * @route GET /api/thoughts/getThoughts
 * @description Gets all thoughts for the current user
 * @access Private
 */
router.get("/getThoughts", verify, (req, res) => {
    // Find the thoughts for that user and return them. If there is an error or none are found return a relevant msg
    Thought.find({user: req.user._id}, "_id feeling cause justified reasons user dateCreated", (err, thoughts) => {
        if (!thoughts || thoughts.length === 0) return makeResponse(res, req, {message: "Thoughts not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {thoughts}, 200);
    });
});
/**
 * @route GET /api/thoughts/getThoughts/:thoughtId
 * @description Gets the thought for the current user with the matching ID
 * @access Private
 */
router.get("/getThoughts/:thoughtId", verify, (req, res) => {
    // Find a singular thought by a given ID and the user. If there is an error or the thought isnt found return a relevant msg
    Thought.findOne({user: req.user._id, _id: req.params.thoughtId}, "_id feeling cause justified reasons user dateCreated", (err, thought) => {
        if (!thought) return makeResponse(res, req, {message: "Thought not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, thought, 200);
    });
});
/**
 * @route PUT /api/thoughts/updateThoughts/:thoughtId
 * @description Updates the thought for the current user with the matching ID. Can update the values for feeling, cause
 *              and justified
 * @access Private
 */
router.put("/updateThoughts/:thoughtId", verify, (req, res) => {
    // Validate the req.body against thought update validation
    const { error } = thoughtValidation(req.body);
    if (error) return makeResponse(res, req, {message: error.details[0].message}, 400);
    // Find the thought the user wishes to update and update it to the body of the request
    Thought.findOneAndUpdate({user: req.user._id, _id: req.params.thoughtId}, req.body, (err, thought) => {
        if (!thought) return makeResponse(res, req, {message: "Thought not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "Thought " + req.params.thoughtId + " updated successfully."}, 200);
    });
});
/**
 * @route DELETE /api/thoughts/deleteThoughts/:thoughtId
 * @description Deletes the thought for the current user with the matching ID.
 * @access Private
 */
router.delete("/deleteThoughts/:thoughtId", verify, (req, res) => {
    // Find the thought and delete it
    Thought.findByIdAndDelete(req.params.thoughtId, (err, thought) => {
        // If there is an error or it is not found return relevant messages
        if (!thought) return makeResponse(res, req, {message: "Thought not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "Thought " + req.params.thoughtId + " deleted successfully."}, 200);
    });
});
/**
 * @route DELETE /api/thoughts/deleteThoughts
 * @description Deletes all thoughts for the current user.
 * @access Private
 */
router.delete("/deleteThoughts", verify, (req, res) => {
    // Delete all thoughts made by the current user
    Thought.deleteMany({user: req.user._id}, (err, thoughts) => {
        // If there are none deleted or there is an error return a relevant message
        if (!thoughts || thoughts.deletedCount === 0) return makeResponse(res, req, {message: "Thoughts not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        // Return success message
        return makeResponse(res, req, {message: "All thoughts for user " + req.user._id + " deleted successfully."}, 200);
    });
});
/**
 * @route PUT /api/thoughts/updateThoughts/:thoughtId/addReasons
 * @description Adds a reason to the specified thought in the URL
 * @access Private
 */
router.put("/updateThoughts/:thoughtId/addReasons", verify, (req, res) => {
    const newReason = new Reason({
        isPositive: req.body.isPositive,
        description: req.body.description
    });
    Thought.updateOne({user: req.user._id, _id: req.params.thoughtId}, {$push: {reasons: newReason}}, (err, thought) => {
        if (!thought) return makeResponse(res, req, {message: "Thought not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "Reason added for thought " + req.params.thoughtId + "."}, 200);
    });
});
/**
 * @route PUT /api/thoughts/:thoughtId/deleteReasons/:reasonId
 * @description Removes a specified reason from the specified thought in the URL
 * @access Private
 */
router.put("/updateThoughts/:thoughtId/deleteReasons/:reasonId", verify, (req, res) => {
    Thought.updateOne({user: req.user._id, _id: req.params.thoughtId}, {$pull: {reasons: {_id: req.params.reasonId}}}, (err, thought) => {
        if (!thought) return makeResponse(res, req, {message: "Thought not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "Reason " + req.params.reasonId + " deleted successfully."}, 200);
    });
});
/**
 * @route PUT /api/thoughts/updateThoughts/:thoughtId/deleteReasons
 * @description Removes all reasons from the specified thought in the URL
 * @access Private
 */
router.put("/updateThoughts/:thoughtId/deleteReasons", verify, (req, res) => {
    Thought.updateOne({user: req.user._id, _id: req.params.thoughtId}, {$set: {reasons: []}}, (err, thought) => {
        if (!thought) return makeResponse(res, req, {message: "Thought not found."}, 404);
        if (err) return makeResponse(res, req, {message: "Internal server error."}, 500);
        return makeResponse(res, req, {message: "All reasons for thought " + req.params.thoughtId + " deleted successfully."}, 200);
    });
});

module.exports = router;