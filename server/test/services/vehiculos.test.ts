import app from '../../src/app';

describe('\'vehiculos\' service', () => {
  it('registered the service', () => {
    const service = app.service('vehiculos');
    expect(service).toBeTruthy();
  });
});
