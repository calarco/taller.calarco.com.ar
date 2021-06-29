import app from '../../src/app';

describe('\'fabricantes\' service', () => {
  it('registered the service', () => {
    const service = app.service('fabricantes');
    expect(service).toBeTruthy();
  });
});
