import app from '../../src/app';

describe('\'presupuestos\' service', () => {
  it('registered the service', () => {
    const service = app.service('presupuestos');
    expect(service).toBeTruthy();
  });
});
