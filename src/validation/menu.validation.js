const Joi = require('joi');

const createMenuSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    role_id: Joi.number().integer().required(),
    parent_id: Joi.number().integer().required(),
    child_id: Joi.number().integer().required(),
    allow_access: Joi.boolean().required(),
    allow_add: Joi.boolean().required(),
    allow_edit: Joi.boolean().required(),
    allow_delete: Joi.boolean().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createMenuSchema
};
