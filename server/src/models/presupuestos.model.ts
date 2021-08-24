// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/lib/hooks";

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get("sequelizeClient");
    const presupuestos = sequelizeClient.define("presupuestos", 
        {
            patente: {
                type: DataTypes.STRING(7),
                allowNull: false,
            },
            km: {
                type: DataTypes.STRING(7),
                allowNull: false,
                validate: {
                    isInt: true,
                    isNumeric: true,
                    min: 0o0,
                    max: 9999999
                }
            },
            motivo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            labor: {
                type: DataTypes.STRING(7),
                allowNull: false,
                validate: {
                    isInt: true,
                    isNumeric: true,
                    min: 0o0,
                    max: 9999999
                }
            },
            repuestos: {
                type: DataTypes.JSON,
                allowNull: false
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
        });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (presupuestos as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    presupuestos.belongsTo(models.modelos);
  };

  return presupuestos;
}
