const Joi = require('joi');

const createChildmenuSchema = Joi.object({
    tenantId: Joi.required(),
    menu_name: Joi.string().required(),
    parent_id: Joi.required(),
    display_rank: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createChildmenuSchema
};
