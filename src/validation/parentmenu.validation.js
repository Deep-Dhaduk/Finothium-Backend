const Joi = require('joi');

const createParentMenuSchema = Joi.object({
    menu_name: Joi.string().required(),
    display_rank: Joi.number().integer().required(),
    status: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required()
});

module.exports = {
    createParentMenuSchema
};
