const bcrypt = require("bcryptjs");
const RevokedToken = require("../model/RevokedToken");
const User = require("../model/User");

/**
 * Generates a salt and then hashes the password using bcrypt with the salt
 * @param {*} password The plain text password inputted by the user
 */
const generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
};
/**
 * Checks if the password given by the user matches the password in the user document
 * @param {*} password Plain text password inputted by the user
 * @param {*} user User object from the database
 */
const checkPassword = async (password, user) => {
    const validPass = await bcrypt.compare(password, user.password);
    return validPass;
};
/**
 * Stores the token in the revoked token table in the database so they cannot be used
 * anymore
 * @param {*} token JSON web token to revoke
 */
const revokeToken = async (token) => {
    const revokedToken = new RevokedToken({
        token
    });
    await revokedToken.save();
};
/**
 * Checks if there is already an email in the database equal to the email given. If a
 * match is found return the user with the email
 * @param {*} email Email to check if it exists
 */
const checkEmailExists = async (email) => {
    const emailExist = await User.findOne({email});
    if (emailExist) return emailExist;
    return false;
};
/**
 * Checks if a user with a given ID exists. If a match is found return the user
 * @param {*} userId User ID to check if it exists
 */
const checkUserExists = async (userId) => {
    const user = await User.findById(userId);
    if (user) return user;
    return false;
};

module.exports.generatePasswordHash = generatePasswordHash;
module.exports.checkPassword = checkPassword;
module.exports.revokeToken = revokeToken;
module.exports.checkEmailExists = checkEmailExists;
module.exports.checkUserExists = checkUserExists;