const Joi = require('joi');

const createPaymentSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    transaction_date: Joi.date().required(),
    transaction_type: Joi.string().required(),
    payment_type: Joi.string().required(),
    client_category_name: Joi.string().required(),
    accountId: Joi.number().integer().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createPaymentSchema
};
