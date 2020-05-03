import Auth from './auth';
import Patient from './patient';

export default class Routes {
	constructor(router) {
		this.router = router;
	}

	async register() {
		/*Admin Routes*/
		this.auth = new Auth(this.router);
		this.patient = new Patient(this.router);

		await this.auth.routes();
		await this.patient.routes();
	}
}
