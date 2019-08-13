const mongoose = require("mongoose");
/**
 * Schema for users, setting values that must be met.
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        unique: true,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);