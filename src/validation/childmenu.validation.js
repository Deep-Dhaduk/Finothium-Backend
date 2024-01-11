const Joi = require('joi');

const createChildmenuSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    menu_name: Joi.string().required(),
    parent_id: Joi.required(),
    display_rank: Joi.number().integer().required(),
    status: Joi.string().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required()
});

module.exports = {
    createChildmenuSchema
};
