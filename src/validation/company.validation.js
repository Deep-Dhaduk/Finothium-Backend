const Joi = require('joi');

const createCompanySchema = Joi.object({
    company_name: Joi.string().required(),
    legal_name: Joi.string().required(),
    authorize_person_name: Joi.string().required(),
    address: Joi.string().required(),
    contact_no: Joi.string().required(),
    email: Joi.string().required(),
    website: Joi.string().required(),
    pan: Joi.string().required(),
    gstin: Joi.string().required(),
    status: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required()
});

module.exports = {
    createCompanySchema
};
