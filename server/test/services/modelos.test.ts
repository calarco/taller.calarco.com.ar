import app from '../../src/app';

describe('\'modelos\' service', () => {
  it('registered the service', () => {
    const service = app.service('modelos');
    expect(service).toBeTruthy();
  });
});
