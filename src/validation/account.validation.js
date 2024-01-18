const Joi = require('joi');

const createAccountSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    account_name: Joi.string().required(),
    group_name: Joi.object({
        group_name_Id: Joi.number().integer().required(),
        group_name: Joi.string().required(),
    }).required(),
    join_date: Joi.date().required(),
    exit_date: Joi.date().required(),
    account_type: Joi.object({
        account_type_Id: Joi.number().integer().required(),
        account_type: Joi.string().required(),
    }).required(),
    status: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createAccountSchema
};
