const Joi = require('joi');

const createRoleSchema = Joi.object({
    tenantId: Joi.required(),
    rolename: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createRoleSchema
};
