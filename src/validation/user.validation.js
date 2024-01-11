const Joi = require('joi');

const createUserSchema = Joi.object({
  tenantId: Joi.number().required(),
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
  profile_image: Joi.string().allow(''),
  companyId: Joi.number().required(),
  status: Joi.string().required(),
  roleId: Joi.number().required(),
  createdBy: Joi.number().required()
});

module.exports = {
  createUserSchema
};
