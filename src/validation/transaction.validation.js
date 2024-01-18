const Joi = require('joi');

const createTransactionSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    transaction_date: Joi.date().required(),
    transaction_type: Joi.string().required(),
    payment_type: Joi.object({
        payment_type_Id: Joi.number().integer().required(),
        payment_type: Joi.string().required(),
    }).required(),
    client_category_name: Joi.object({
        client_category_name_Id: Joi.number().integer().required(),
        client_category_name: Joi.string().required(),
    }).required(),
    account_name: Joi.object({
        accountId: Joi.number().integer().required(),
        account_name: Joi.string().required(),
    }).required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createTransactionSchema
};
