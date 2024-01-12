const Joi = require('joi');

const menuItemSchema = Joi.object({
    child_id: Joi.number().integer().required(),
    allow_access: Joi.number().valid(0, 1).required(),
    allow_add: Joi.number().valid(0, 1).required(),
    allow_edit: Joi.number().valid(0, 1).required(),
    allow_delete: Joi.number().valid(0, 1).required(),
});

const createMenuSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    role_id: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required(),
    menuItems: Joi.array().items(menuItemSchema).min(1).required(),
});

module.exports = {
    createMenuSchema,
};
