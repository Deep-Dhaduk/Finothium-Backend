const Joi = require('joi');

const createAccountSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    account_name: Joi.string().required(),
    group_name_Id: Joi.number().integer().required(),
    join_date: Joi.date().required(),
    exit_date: Joi.string().allow(""),
    account_type_Id: Joi.number().integer().required(),
    status: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createAccountSchema
};
