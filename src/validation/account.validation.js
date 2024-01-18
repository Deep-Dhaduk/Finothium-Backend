const Joi = require('joi');

const createAccountSchema = Joi.object({
    tenantId: Joi.number().integer().required(),
    account_name: Joi.string().required(),
    group_name_Id: Joi.number().integer().required(),
    join_date: Joi.date().required(),
    exit_date: Joi.date().allow(""),
    account_type_Id: Joi.number().integer().required(),
    status: Joi.string().required(),
    createdBy: Joi.number().integer().required()
});

module.exports = {
    createAccountSchema
};
