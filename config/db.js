const db = {
	development: {
		mongo: {
			host: 'localhost',
			port: 27017,
			database: 'hkstp_dev'
		},
		redis: {
			host: 'localhost',
			port: 6379
		}
	},
	staging: {
		mongo: {
			host: 'localhost',
			port: 27017,
			database: 'hkstp_staging'
		},
		redis: {
			host: 'localhost',
			port: 6379
		}
	},
	production: {
		mongo: {
			host: 'localhost',
			port: 27017,
			database: 'hkstp_live'
		},
		redis: {
			host: 'localhost',
			port: 6379
		}
	}
};

export default db;
