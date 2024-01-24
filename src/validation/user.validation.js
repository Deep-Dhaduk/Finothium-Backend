const Joi = require('joi');

const createUserSchema = Joi.object({
  tenantId: Joi.number().integer().required(),
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
  profile_image: Joi.string().allow(''),
  companies: Joi.array().items(
    Joi.number().integer().required()
  ).required(),
  status: Joi.number().integer().required(),
  roleId: Joi.number().integer().required(),
  createdBy: Joi.number().required(),
  updatedBy: Joi.number().required()
});

module.exports = {
  createUserSchema
};
