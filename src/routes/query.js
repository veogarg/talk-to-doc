import QueryController from '../controllers/QueryController';

export default class Patient {
	constructor(router) {
		this.router = router;
		this.query = new QueryController();
	}

	async routes() {
		await this.query.init();

		this.router
			.route('/patient/query')
			.post((req, res) => this.query.saveQuery(req, res))
			.get((req, res) => this.query.getMyQueries(req, res));
		
		this.router
			.route('/allQueries')
			.get((req, res) => this.query.getAllQueries(req, res));

		this.router
			.route('/doctor/acknowledgement')
			.post((req, res) => this.query.docAcknowledge(req, res));
	}
}
