import app from '../../src/app';

describe('\'reparaciones\' service', () => {
  it('registered the service', () => {
    const service = app.service('reparaciones');
    expect(service).toBeTruthy();
  });
});
