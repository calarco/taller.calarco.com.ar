// Initializes the `vehiculos` service on path `/vehiculos`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Vehiculos } from './vehiculos.class';
import createModel from '../../models/vehiculos.model';
import hooks from './vehiculos.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'vehiculos': Vehiculos & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/vehiculos', new Vehiculos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('vehiculos');

  service.hooks(hooks);
}
