import Joi from 'joi';

export const loginSchema = Joi.object().keys({
  email: Joi.string().required().error(() => 'Email is required'),
  password: Joi.string().required().error(() => 'Password is required')
});
