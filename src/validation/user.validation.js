const Joi = require('joi');

const createUserSchema = Joi.object({
  tenantId: Joi.required(),
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
  profile_image: Joi.string().allow(''),
  companyId: Joi.required(),
  status: Joi.string().required(),
  roleId: Joi.required(),
  createdBy: Joi.required()
});

module.exports = {
  createUserSchema
};
