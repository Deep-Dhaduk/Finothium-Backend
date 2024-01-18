const Joi = require('joi');

const createUserSchema = Joi.object({
  tenantId: Joi.number().integer().required(),
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
  profile_image: Joi.string().allow(''),
  companies: Joi.array().items(
    Joi.object({
        companyId: Joi.required(),
        companyName: Joi.required()
    })
).required(),
  status: Joi.string().required(),
  role: Joi.object({
    roleId: Joi.number().integer().required(),
    role: Joi.string().required(),
}).required(),
  createdBy: Joi.number().required(),
  updatedBy: Joi.number().required()
});

module.exports = {
  createUserSchema
};
