const Joi = require('joi');

const createReportSchema = Joi.object({
    tenantId: Joi.required(),
    company_wise_statement: Joi.string().required(),
    group_wise_statement: Joi.string().required(),
    account_wise_statement: Joi.string().required(),
    payment_type_wise_statement: Joi.string().required(),
    client_wise_statement: Joi.string().required(),
    category_wise_statement: Joi.string().required(),
    createdBy: Joi.required()
});


module.exports = {
    createReportSchema
};
