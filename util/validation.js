const Joi = require("@hapi/joi");

/**
 * Validates registration data against a schema
 * @param {*} data JSON with relevant registration data
 */
const registerValidation = (data) => {
    const schema = {
        name: Joi.string().min(6).max(30).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};
/**
 * Validates login data against a schema
 * @param {*} data JSON with relevant login data
 */
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};
/**
 * Validates thought data against a schema
 * @param {*} data JSON with relevant thought data
 */
const thoughtValidation = (data) => {
    const schema = {
        feeling: Joi.string().min(3).max(255).required(),
        cause: Joi.string().min(6).max(1024).required(),
        justified: Joi.boolean()
    };
    return Joi.validate(data, schema);
};
/**
 * Validates updates for passwords against a schema
 * @param {*} data JSON with relevant password update data
 */
const passwordUpdateValidation = (data) => {
    const schema = {
        currentPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required()
    };
    return Joi.validate(data, schema);
};
/**
 * Validates updates for emails against a schema
 * @param {*} data JSON with relevant email update data
 */
const emailUpdateValidation = (data) => {
    const schema = {
        newEmail: Joi.string().min(6).required().email()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.thoughtValidation = thoughtValidation;
module.exports.passwordUpdateValidation = passwordUpdateValidation;
module.exports.emailUpdateValidation = emailUpdateValidation;