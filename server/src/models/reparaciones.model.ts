// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/lib/hooks";

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get("sequelizeClient");
    const reparaciones = sequelizeClient.define("reparaciones", 
        {
            km: {
                type: DataTypes.STRING(7),
                allowNull: false,
                validate: {
                    isInt: true,
                    isNumeric: true,
                    min: 0o0,
                    max: 9999999,
                }
            },
            reparacion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            repuestos: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            costo: {
                type: DataTypes.STRING(7),
                allowNull: false,
                validate: {
                    isInt: true,
                    isNumeric: true,
                    min: 0o0,
                    max: 9999999,
                }
            },
            labor: {
                type: DataTypes.STRING(7),
                allowNull: false,
                validate: {
                    isInt: true,
                    isNumeric: true,
                    min: 0o0,
                    max: 9999999,
                }
            },
            companyId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            hooks: {
                beforeCount(options: any): HookReturn {
                    options.raw = true;
                }
            }
        }
    );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (reparaciones as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
        reparaciones.belongsTo(models.vehiculos);
  };

  return reparaciones;
}
