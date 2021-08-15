// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from "sequelize";
import { Application } from "../declarations";
import { HookReturn } from "sequelize/types/lib/hooks";

export default function (app: Application): typeof Model {
    const sequelizeClient: Sequelize = app.get('sequelizeClient');
    const vehiculos = sequelizeClient.define('vehiculos',
        {
            patente: {
                type: DataTypes.STRING(7),
                allowNull: false,
                unique: true
            },
            year: {
                type: DataTypes.STRING(4),
                allowNull: true,
            },
            combustible: {
                type: DataTypes.ENUM(
                    "Nafta",
                    "Diesel",
                    "GNC",
                    "Electrico",
                    "Hibrido"
                ),
                allowNull: false,
                defaultValue: "Nafta"
            },
            cilindrada: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: ""
            },
            vin: {
                type: DataTypes.STRING(17),
                allowNull: true,
                defaultValue: ""
            }
        },
        {
            hooks: {
                beforeCount(options: any): HookReturn {
                    options.raw = true;
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (vehiculos as any).associate = function (models: any): void {
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
        vehiculos.belongsTo(models.clientes);
        vehiculos.belongsTo(models.modelos);
    };

    return vehiculos;
}
