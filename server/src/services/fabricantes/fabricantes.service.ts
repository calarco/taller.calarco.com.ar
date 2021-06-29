// Initializes the `fabricantes` service on path `/fabricantes`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Fabricantes } from './fabricantes.class';
import createModel from '../../models/fabricantes.model';
import hooks from './fabricantes.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'fabricantes': Fabricantes & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/fabricantes', new Fabricantes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('fabricantes');

  service.hooks(hooks);
}
