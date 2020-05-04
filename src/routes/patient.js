import PatientController from '../controllers/PatientController';

export default class Patient {
	constructor(router) {
		this.router = router;
		this.patient = new PatientController();
	}

	async routes() {
		await this.patient.init();

		this.router
			.route('/patient/query')
			.post((req, res) => this.patient.saveQuery(req, res))
			.get((req, res) => this.patient.getQueries(req, res));
	}
}
