import crypto from 'crypto';

exports.SHA256 = async text => {
	const encrypted = await crypto.createHash('sha256').update(text).digest('hex');
	return encrypted;
};

exports.SHA512 = async text => {
	const encrypted = await crypto.createHash('sha512').update(text).digest('hex');
	return encrypted;
};

exports.OTP = () => {
	return Math.floor(100000 + Math.random() * 900000);
};
