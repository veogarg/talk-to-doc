import Joi from 'joi';

export const validator = (data, schema) => {
	const schemaValidation = Joi.validate(data, schema, {abortEarly: false});
	const errorMessages = [];
	if (schemaValidation.error) {
		if (schemaValidation.error.details) {
			schemaValidation
				.error
				.details
				.forEach(err => {
					errorMessages.push(err.message);
				});
		}
	}

	if (errorMessages.length > 0) {
		return {
			isError: true,
			errors: errorMessages
		};
	}

	return {
		isError: false,
		errors: errorMessages
	};
};
