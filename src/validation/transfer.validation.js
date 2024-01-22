const Joi = require('joi');

const createTransferSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    transactionDate: Joi.date().required(),
    paymentType_Id: Joi.number().integer().required(),
    fromAccount: Joi.number().integer().required(),
    toAccount: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required(),
});

module.exports = {
    createTransferSchema
};
