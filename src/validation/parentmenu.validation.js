const Joi = require('joi');

const createParentMenuSchema = Joi.object({
    tenantId: Joi.required(),
    menu_name: Joi.string().required(),
    display_rank: Joi.number().integer().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createParentMenuSchema
};
