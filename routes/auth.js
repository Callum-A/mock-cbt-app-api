const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = require("../util/verifyToken");
const {
    registerValidation, 
    loginValidation,
    passwordUpdateValidation,
    emailUpdateValidation
} = require("../util/validation");
const {
    generatePasswordHash,
    checkPassword,
    revokeToken,
    checkEmailExists,
    checkUserExists
} = require("../util/authHelpers");
const makeResponse = require("../util/makeResponse");

/**
 * @route POST /api/auth/register
 * @description Registers a new user and saves their details to the database
 * @access Public
 */
router.post("/register", async (req, res) => {
    // Validate the data using validation.js
    const {error} = registerValidation(req.body);
    if (error) return makeResponse(res, req, {message: error.details[0].message}, 400);
    // Check if user already exists if it does return error message
    if((await checkEmailExists(req.body.email))) return makeResponse(res, req, {message: "Email already exists."}, 409);
    // Hash the password
    const hashedPassword = await generatePasswordHash(req.body.password);
    // Create user object
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    // Wait for the user to be saved and if it is return the id else return the error
    try {
        const savedUser = await user.save();
        return makeResponse(res, req, {message: "Created user " + savedUser._id + " successfully."}, 201);
    } catch (err) {
        return makeResponse(res, req, {message: "Internal server error."}, 500);
    }
});
/**
 * @route GET /api/auth/login
 * @description Authenticates the user and returns a token
 * @access Public
 */
router.get("/login", async (req, res) => {
    //Validate the data using validation.js
    const {error} = loginValidation(req.body);
    if (error) return makeResponse(res, req, {message: error.details[0].message}, 400);
    //Check if the user exists
    const user = await checkEmailExists(req.body.email);
    if (!user) return makeResponse(res, req, {message: "Invalid email or password."}, 403);
    //Check if password is correct
    if (!(await checkPassword(req.body.password, user))) return makeResponse(res, req, {message: "Invalid email or password."}, 403);
    //Create and assign a token
    const token = jwt.sign({_id: user._id, admin: user.admin}, process.env.TOKEN_SECRET);
    return makeResponse(res, req, {token}, 200);
});
/**
 * @route PUT /api/auth/changePassword
 * @description Updates the password field if the request authenticates
 * @access Private
 */
router.put("/changePassword", verify, async (req, res) => {
    // Validate the data
    const {error} = passwordUpdateValidation(req.body);
    if (error) return makeResponse(res, req, {message: error.details[0].message}, 400);
    // Find the user if it doesn't exist return error message
    const user = await checkUserExists(req.user._id)
    if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
    // Check the current password against the old password, if it is incorrect return generic error message
    if (!(await checkPassword(req.body.currentPassword, user))) return makeResponse(res, req, {message: "User not found."}, 404);
    // If it is correct generate the salt and hash the new password
    const hashedNewPassword = await generatePasswordHash(req.body.newPassword);
    // Set the new password and prepare to revoke the token
    user.password = hashedNewPassword;
    try {
        // Save the changes to the password and revoke the token
        user.save();
        await revokeToken(req.header("auth-token"));
        return makeResponse(res, req, {message: "Password changed please relogin."}, 200);
    } catch (err) {
        return makeResponse(res, req, {message: "Internal server error."}, 500);
    }
});
/**
 * @route PUT /api/auth/changeEmail
 * @description Updates the email field if the request authenticates
 * @access Private
 */
router.put("/changeEmail", verify, async (req, res) => {
    // Validate the data
    const {error} = emailUpdateValidation(req.body);
    if (error) return makeResponse(res, req, {message: error.details[0].message}, 400);
    // Find the user if it doesn't exist return error message
    if(!(await checkUserExists(req.user._id))) return makeResponse(res, req, {message: "User not found."}, 404);
    // Check if the email is already taken
    const user = await checkEmailExists(req.body.email);
    if (!user) return makeResponse(res, req, {message: "User not found."}, 404);
    // Set the email to the new email
    user.email = req.body.newEmail;
    try {
        // Save the changes to the email and revoke the token
        user.save();
        await revokeToken(req.header("auth-token"));
        return makeResponse(res, req, {message: "Email changed please relogin."}, 200);
    } catch (err) {
        return makeResponse(res, req, {message: "Internal server error."}, 500);
    }
});

module.exports = router;