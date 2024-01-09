const Joi = require('joi');

const createPaymentSchema = Joi.object({
    tenantId: Joi.required(),
    transaction_date: Joi.string().required(),
    transaction_type: Joi.string().required(),
    payment_type: Joi.string().required(),
    client_category_name: Joi.string().required(),
    accountId: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createPaymentSchema
};
