import Joi from 'joi';
export const newQuery = Joi.object().keys({
	query: Joi.string().min(50).max(500).required().error(() => 'Query details are required (Min length:50 chars , Max Length: 500 Chars)')
});
