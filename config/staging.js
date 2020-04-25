import db from './db';

module.exports = {
	port: 3035,
	db: db.staging,
	logger: {
		maxSize: 512000,
		maxFiles: 100
	},
	secretKey: 'hkstp2k2o',
	saltKey: 'V3O1NF1',
	saltRounds: 5
};
