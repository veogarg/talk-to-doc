import Auth from './auth';
// import SuperAdmin from './superadmin';

export default class Routes {
	constructor(router) {
		this.router = router;
	}

	async register() {
		/*Admin Routes*/
		this.auth = new Auth(this.router);
		// this.superAdmin = new SuperAdmin(this.router);

		await this.auth.routes();
		// await this.superAdmin.routes();
	}
}
