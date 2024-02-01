const Joi = require('joi');

const createClientSchema = Joi.object({
    clientName: Joi.string().required(),
    status: Joi.number().integer().required(),
    createdBy: Joi.number().integer().required(),
    updatedBy: Joi.number().integer().required(),
    type: Joi.string().required()
});

module.exports = {
    createClientSchema
};
