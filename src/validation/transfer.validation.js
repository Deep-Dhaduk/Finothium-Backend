const Joi = require('joi');

const createTransferSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    transactionDate: Joi.date().required(),
    paymentType: Joi.object({
        paymentType_Id: Joi.number().integer().required(),
        paymentType: Joi.string().required(),
    }).required(),
    fromAccount: Joi.object({
        fromAccount_Id: Joi.number().integer().required(),
        fromAccount: Joi.string().required(),
    }).required(),
    toAccount: Joi.object({
        toAccount_Id: Joi.number().integer().required(),
        toAccount: Joi.string().required(),
    }).required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createTransferSchema
};
