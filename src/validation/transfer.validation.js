const Joi = require('joi');

const createTransferSchema = Joi.object({
    tenantId: Joi.required(),
    transactionDate: Joi.string().required(),
    paymentType: Joi.string().required(),
    fromAccount: Joi.string().required(),
    toAccount: Joi.string().email().required(),
    amount: Joi.required(),
    description: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createTransferSchema
};
