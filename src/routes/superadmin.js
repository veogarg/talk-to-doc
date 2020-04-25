import SuperAdminController from '../controllers/SuperAdmin';

export default class superadmin {
	constructor(router) {
		this.router = router;
		this.superadminInstance = new SuperAdminController();
	}

	async routes() {
		await this.superadminInstance.init();

		this.router
			.route('/superadmin')
			.post((req, res) => this.superadminInstance.save(req, res))
			.get((req, res) => this.superadminInstance.getUser(req, res));
	}
}
