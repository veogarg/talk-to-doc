import db from './db';

module.exports = {
	port: 3100,
	db: db.production,
	logger: {
		maxSize: 5120000,
		maxFiles: 200
	},
	secretKey: 'V1k@sHk$Tp',
	saltKey: 'Hk$tp2k2oV3O',
	saltRounds: 8
};
