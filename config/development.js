import db from './db';

module.exports = {
	port: 3031,
	db: db.development,
	logger: {
		maxSize: 512000,
		maxFiles: 100
	},
	secretKey: 'talktodoc2k2o',
	saltKey: 'V3O1NF1',
	saltRounds: 2
};
