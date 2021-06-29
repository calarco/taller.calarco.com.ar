// Initializes the `clientes` service on path `/clientes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Clientes } from './clientes.class';
import createModel from '../../models/clientes.model';
import hooks from './clientes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'clientes': Clientes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/clientes', new Clientes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('clientes');

  service.hooks(hooks);
}
