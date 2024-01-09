const Joi = require('joi');

const createCompanySchema = Joi.object({
    tenantId: Joi.required(),
    company_name: Joi.string().required(),
    legal_name: Joi.string().required(),
    authorize_person_name: Joi.string().required(),
    address: Joi.string().required(),
    contact_no: Joi.number().integer().min(1000000000).max(9999999999).required(),
    email: Joi.string().required(),
    website: Joi.string().required(),
    pan: Joi.string().required(),
    gstin: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createCompanySchema
};
