const Joi = require('joi');

const createTransferSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    transactionDate: Joi.date().required(),
    paymentType: Joi.string().required(),
    fromAccount: Joi.string().required(),
    toAccount: Joi.string().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createTransferSchema
};
