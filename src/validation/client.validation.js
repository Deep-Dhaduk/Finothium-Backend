const Joi = require('joi');

const createClientSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    clientName: Joi.string().required(),
    status: Joi.number().integer().required(),
    companyId: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createClientSchema
};
