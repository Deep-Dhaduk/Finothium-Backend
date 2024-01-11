const Joi = require('joi');

const createParentMenuSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    menu_name: Joi.string().required(),
    display_rank: Joi.number().integer().required(),
    status: Joi.string().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required()
});

module.exports = {
    createParentMenuSchema
};
