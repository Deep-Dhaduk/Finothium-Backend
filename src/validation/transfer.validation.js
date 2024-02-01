const Joi = require('joi');

const createTransferSchema = Joi.object({
    transactionDate: Joi.string().required(),
    paymentType_Id: Joi.number().integer().required(),
    fromAccount: Joi.number().integer().required(),
    toAccount: Joi.number().integer().required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required()
});

module.exports = {
    createTransferSchema
};
