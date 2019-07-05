'use strict';

const mock = require('egg-mock');

describe('test/models-export.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/models-export-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/models/in')
      // .expect('hi, modelsExport')
      // .expect(200)
      .then(res => {
        console.log('/ 请求结果: ', res.text);
      });
  });
});
