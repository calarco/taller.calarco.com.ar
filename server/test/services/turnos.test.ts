import app from '../../src/app';

describe('\'turnos\' service', () => {
  it('registered the service', () => {
    const service = app.service('turnos');
    expect(service).toBeTruthy();
  });
});
