const db = {
	development: {
		mongo: {
			host: 'localhost',
			port: 27017,
			database: 'talktodoc_dev'
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
			database: 'talktodoc_staging'
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
			database: 'talktodoc_live'
		},
		redis: {
			host: 'localhost',
			port: 6379
		}
	}
};

export default db;
