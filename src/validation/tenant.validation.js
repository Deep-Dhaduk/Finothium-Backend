const Joi = require('joi');

const createTenantSchema = Joi.object({
    tenantname: Joi.string().required(),
    personname: Joi.string().required(),
    address: Joi.string().required(),
    contact: Joi.string().required(),
    email: Joi.string().email().required(),
    startdate: Joi.date().required(),
    enddate: Joi.date().required(),
    status:Joi.number().integer().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required(),
});

module.exports = {
    createTenantSchema
};
