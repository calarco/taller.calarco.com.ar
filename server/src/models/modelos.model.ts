// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/lib/hooks";

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get("sequelizeClient");
    const modelos = sequelizeClient.define("modelos", 
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
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
  (modelos as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    modelos.belongsTo(models.fabricantes);
  };

  return modelos;
}
