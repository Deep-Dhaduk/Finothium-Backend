const Joi = require('joi');

const createCommonSchema = Joi.object({
    tenantId: Joi.required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createCommonSchema
};
