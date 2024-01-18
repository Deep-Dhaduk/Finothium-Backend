const Joi = require('joi');

const createCompanySchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    company_name: Joi.string().required(),
    legal_name: Joi.string().required(),
    authorize_person_name: Joi.string().required(),
    pan: Joi.string().required(),
    gstin: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required(),
});

module.exports = {
    createCompanySchema
};
