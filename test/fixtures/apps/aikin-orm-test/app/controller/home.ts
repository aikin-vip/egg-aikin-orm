import { Controller } from 'egg';

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.orm.name;
  }
}

module.exports = HomeController;
