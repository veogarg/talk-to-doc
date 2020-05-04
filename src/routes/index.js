import Auth from './auth';
import Query from './query';

export default class Routes {
	constructor(router) {
		this.router = router;
	}

	async register() {
		/*Admin Routes*/
		this.auth = new Auth(this.router);
		this.query = new Query(this.router);

		await this.auth.routes();
		await this.query.routes();
	}
}
