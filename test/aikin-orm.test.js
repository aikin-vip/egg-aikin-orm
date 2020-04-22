'use strict';

const mock = require('egg-mock');

describe('test/aikin-orm.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/aikin-orm-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, orm')
      .expect(200);
  });
});
