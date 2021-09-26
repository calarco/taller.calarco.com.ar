import { Application } from '../declarations';
import users from './users/users.service';
import clientes from './clientes/clientes.service';
import fabricantes from './fabricantes/fabricantes.service';
import modelos from './modelos/modelos.service';
import presupuestos from './presupuestos/presupuestos.service';
import turnos from './turnos/turnos.service';
import reparaciones from './reparaciones/reparaciones.service';
import vehiculos from './vehiculos/vehiculos.service';
import mailer from './mailer/mailer.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(clientes);
  app.configure(fabricantes);
  app.configure(modelos);
  app.configure(presupuestos);
  app.configure(turnos);
  app.configure(reparaciones);
  app.configure(vehiculos);
  app.configure(mailer);
}
