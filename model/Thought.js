const mongoose = require("mongoose");

const reasonSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    isPositive: {
        type: Boolean,
        default: false,
        required: true
    }
});

const thoughtSchema = new mongoose.Schema({
    feeling: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    cause: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    justified: {
        type: Boolean,
        required: true,
        default: false
    },
    reasons: [reasonSchema],
    user: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports.Thought = mongoose.model("Thought", thoughtSchema);
module.exports.Reason = mongoose.model("Reason", reasonSchema);