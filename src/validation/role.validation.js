const Joi = require('joi');

const createRoleSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    rolename: Joi.string().required(),
    status: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createRoleSchema
};
