const Joi = require('joi');

const createTransactionSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    transaction_date: Joi.string().required(),
    transaction_type: Joi.string().required(),
    payment_type_Id: Joi.number().integer().required(),
    accountId: Joi.number().integer().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required(),
    clientId: Joi.number().integer().required()
});

module.exports = {
    createTransactionSchema
};