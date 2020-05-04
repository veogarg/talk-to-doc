import QueryController from '../controllers/QueryController';

export default class Patient {
	constructor(router) {
		this.router = router;
		this.patient = new QueryController();
	}

	async routes() {
		await this.patient.init();

		this.router
			.route('/patient/query')
			.post((req, res) => this.patient.saveQuery(req, res))
			.get((req, res) => this.patient.getMyQueries(req, res));
		
		this.router
			.route('/allQueries')
			.get((req, res) => this.patient.getAllQueries(req, res));
	}
}
