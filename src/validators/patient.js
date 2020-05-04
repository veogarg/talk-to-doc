import Joi from 'joi';
export const newQuery = Joi.object().keys({
	query: Joi.string().required().error(() => 'Query details are required'),
	email: Joi.string().email().required().error(() => 'Valid Email is required'),
	authPassword: Joi.string()
		.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,25}$/)
		.required().min(6).max(25)
		.error(() => 'Password with min 6 characters, must contain small, caps, number and a symbol'),
});
