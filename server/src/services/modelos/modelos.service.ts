// Initializes the `modelos` service on path `/modelos`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Modelos } from './modelos.class';
import createModel from '../../models/modelos.model';
import hooks from './modelos.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'modelos': Modelos & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: {
      default: 100,
      max: 200
    }
  };

  // Initialize our service with any options it requires
  app.use('/modelos', new Modelos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('modelos');

  service.hooks(hooks);
}
