// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/lib/hooks";

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get("sequelizeClient");
    const clientes = sequelizeClient.define("clientes", 
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            apellido: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            dni: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            empresa: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            telefono: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                defaultValue: ""
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
        },
        {
            hooks: {
                beforeCount(options: any): HookReturn {
                    options.raw = true;
                }
            }
        });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (clientes as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return clientes;
}
