'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = { plugin: 'hi, ' + this.app.plugins.modelsExport.name };
  }
}

module.exports = HomeController;
