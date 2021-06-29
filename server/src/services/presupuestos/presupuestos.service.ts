// Initializes the `presupuestos` service on path `/presupuestos`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Presupuestos } from './presupuestos.class';
import createModel from '../../models/presupuestos.model';
import hooks from './presupuestos.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'presupuestos': Presupuestos & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/presupuestos', new Presupuestos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('presupuestos');

  service.hooks(hooks);
}
