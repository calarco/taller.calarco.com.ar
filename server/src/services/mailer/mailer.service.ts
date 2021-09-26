// Initializes the `mailer` service on path `/mailer`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Mailer } from './mailer.class';
import hooks from './mailer.hooks';
const Fmailer = require("feathers-mailer");
const smtpTransport = require("nodemailer-smtp-transport");

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'mailer': Mailer & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    app.use(
        "/mailer",
        Fmailer(
            smtpTransport({
                service: "gmail",
                auth: {
                    user: "gabimezzanotte@gmail.com",
                    pass: "luvsoiukljhfhenl",
                }
            }),
            { from: "gabimezzanotte@gmail.com", }
        )
    );

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');

  service.hooks(hooks);
}