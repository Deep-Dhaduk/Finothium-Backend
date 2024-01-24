const Joi = require('joi');

const createCommonSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    status: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createCommonSchema
};
