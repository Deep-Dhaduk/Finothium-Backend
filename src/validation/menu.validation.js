const Joi = require('joi');

const createMenuSchema = Joi.object({
    tenantId: Joi.required(),
    role_id: Joi.required(),
    parent_id: Joi.required(),
    child_id: Joi.required(),
    allow_access: Joi.boolean().required(),
    allow_add: Joi.boolean().required(),
    allow_edit: Joi.boolean().required(),
    allow_delete: Joi.boolean().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createMenuSchema
};
