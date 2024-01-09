const Joi = require('joi');

const createTenantSchema = Joi.object({
    tenantname: Joi.string().required(),
    personname: Joi.string().required(),
    address: Joi.string().required(),
    contact: Joi.string().required(),
    email: Joi.string().email().required(),
    startdate: Joi.string().required(),
    enddate: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createTenantSchema
};
