const Joi = require('joi');

const createAccountSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    account_name: Joi.string().required(),
    group_name: Joi.string().required(),
    join_date: Joi.date().required(),
    exit_date: Joi.date().required(),
    account_type: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createAccountSchema
};
