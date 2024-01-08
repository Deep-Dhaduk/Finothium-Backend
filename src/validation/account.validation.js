const Joi = require('joi');

const createAccountSchema = Joi.object({
    tenantId: Joi.required(),
    account_name: Joi.string().required(),
    group_name: Joi.string().required(),
    join_date: Joi.string().required(),
    exit_date: Joi.string().required(),
    account_type: Joi.string().required(),
    status: Joi.string().required(),
    createdBy: Joi.required()
});

module.exports = {
    createAccountSchema
};
