import Joi from 'joi';

export const superAdminRegistration = Joi.object().keys({
	name: Joi.string().required().error(() => 'Name is required'),
	email: Joi.string().email().required().error(() => 'Valid Email is required'),
	authPassword: Joi.string()
  	.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,25}$/)
  	.required().min(6).max(25)
  	.error(() =>'Password with min 6 characters, must contain small, caps, number and a symbol'),
});
