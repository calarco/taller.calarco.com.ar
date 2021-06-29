// Initializes the `reparaciones` service on path `/reparaciones`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Reparaciones } from './reparaciones.class';
import createModel from '../../models/reparaciones.model';
import hooks from './reparaciones.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'reparaciones': Reparaciones & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/reparaciones', new Reparaciones(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('reparaciones');

  service.hooks(hooks);
}
