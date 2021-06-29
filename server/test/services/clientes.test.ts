import app from '../../src/app';

describe('\'clientes\' service', () => {
  it('registered the service', () => {
    const service = app.service('clientes');
    expect(service).toBeTruthy();
  });
});
