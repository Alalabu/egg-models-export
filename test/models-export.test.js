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
        tableName: 'address',
      })
      .set({ aaa: 'cbc' })
      // .expect('hi, modelsExport')
      // .expect(200)
      .then(res => {
        console.log('/ 请求结果: ', res.text);
      });
  });
});
