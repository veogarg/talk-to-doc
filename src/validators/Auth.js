import Joi from 'joi';
import {userRole, gender} from '../../config/constants';

export const loginSchema = Joi.object().keys({
	email: Joi.string().email().required().error(() => 'Email is required'),
	password: Joi.string().required().error(() => 'Password is required')
});

export const userRegistration = Joi.object().keys({
	name: Joi.string().required().error(() => 'Name is required'),
	email: Joi.string().email().required().error(() => 'Valid Email is required'),
	phone: Joi.number().min(1000000000).max(9999999999).error(() => 'Wrong contact number'),
	dob: Joi.date().error(() =>'Invalid Date of birth'),
	gender: Joi.valid(gender.Male, gender.Female, gender.Other),
	role: Joi.valid(userRole.Admin, userRole.Doctor, userRole.Patient),
	password: Joi.string()
		.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,25}$/)
		.required().min(6).max(25)
		.error(() => 'Password with min 6 characters, must contain small, caps, number and a symbol'),
});
