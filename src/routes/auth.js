import AuthController from '../controllers/Auth';

export default class Auth {
	constructor(router) {
		this.router = router;
		this.authInstance = new AuthController();
	}

	async routes() {
		await this.authInstance.init();

		this.router
			.route('/login')
			.post((req, res) => this.authInstance.login(req, res));
		this.router
			.route('/register')
			.post((req, res) => this.authInstance.register(req, res));
	}
}
