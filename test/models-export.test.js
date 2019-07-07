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

  it('should POST /', () => {
    return app.httpRequest()
      .post('/models/attrs')
      .send({
        tableName: 'client',
        authKey: 'xiaofei',
        authSecret: '68b5dfc0-4c82-11e9-81c9-73dbcff02bd1',
      })
      // .expect('hi, modelsExport')
      // .expect(200)
      .then(res => {
        console.log('/ 请求结果: ', res.body);
      });
  });
});
