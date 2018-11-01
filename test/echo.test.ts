import supertest from 'supertest';

import app from '../src/app';

describe('GET /echo', () => {
  it('should return {}', (done) => {
    supertest(app)
      .get('/echo')
      .expect(200, {}, done);
  });
});

describe('GET /echo?a=10&b=20', () => {
  it('should return { a:\"10\", b:\"20\" }', (done) => {
    supertest(app)
      .get('/echo?a=10&b=20')
      .expect(200, { a: '10', b: '20' }, done);
  });
});

describe('GET /echo/twice?a=10&b=20', () => {
  it('should return { a:\"1010\", b:\"2020\" }', (done) => {
    supertest(app)
      .get('/echo/twice?a=10&b=20')
      .expect(200, { a: '1010', b: '2020' }, done);
  });
});
