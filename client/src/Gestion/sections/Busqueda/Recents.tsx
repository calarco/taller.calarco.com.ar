import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";

import { useGestion } from "Gestion/gestionContext";
import Vehiculo from "./VehiculoBox";
import Presupuesto from "./PresupuestoBox";

type List = {
    id: number;
    patente: string;
    createdAt: string;
    updatedAt: string;
    modeloId: number;
    clienteId?: number;
    year?: string;
    combustible?: string;
    cilindrada?: string;
    vin?: string;
    km?: string;
    motivo?: string;
    labor?: string;
    repuestos?: { cantidad: string; repuesto: string; precio: string }[];
}[];

const Recents = function () {
    const { clienteId, setPresupuestoId } = useGestion();

    const [result, setResult] = useState<List>([
        {
            id: 0,
            patente: "",
            createdAt: "",
            updatedAt: "",
            modeloId: 0,
            km: "",
            motivo: "",
            labor: "",
            repuestos: [{ cantidad: "", repuesto: "", precio: "" }],
            year: "",
            combustible: "",
            cilindrada: "",
            vin: "",
            clienteId: 0,
        },
    ]);

    function mergeSortedArray(listA: List, listB: List) {
        let listC = listA.concat(listB);
        listC.sort((a, b) => {
            return b.updatedAt.localeCompare(a.updatedAt);
        });
        return listC;
    }

    useEffect(() => {
        feathersClient
            .service("vehiculos")
            .find({
                query: {
                    $limit: 50,
                    $sort: {
                        updatedAt: -1,
                    },
                },
            })
            .then((vehiculos: Vehiculos) => {
                feathersClient
                    .service("presupuestos")
                    .find({
                        query: {
                            $limit: 50,
                            $sort: {
                                updatedAt: -1,
                            },
                        },
                    })
                    .then((presupuestos: Presupuestos) => {
                        setResult(
                            mergeSortedArray(vehiculos.data, presupuestos.data)
                        );
                    })
                    .catch((error: FeathersErrorJSON) => {
                        console.log("error", error);
                    });
            })
            .catch((error: FeathersErrorJSON) => {
                console.log("error", error);
            });
    }, []);

    return (
        <>
            {result[0] &&
                result[0].id !== 0 &&
                result.map((aResult, index) =>
                    aResult.km &&
                    aResult.motivo &&
                    aResult.labor &&
                    aResult.repuestos ? (
                        <Presupuesto
                            key={index}
                            presupuesto={{
                                id: aResult.id,
                                patente: aResult.patente,
                                km: aResult.km,
                                motivo: aResult.motivo,
                                labor: aResult.labor,
                                repuestos: aResult.repuestos,
                                createdAt: aResult.createdAt,
                                updatedAt: aResult.updatedAt,
                                modeloId: aResult.modeloId,
                            }}
                            onClick={() => {
                                setPresupuestoId(aResult.id);
                            }}
                        />
                    ) : (
                        <Vehiculo
                            key={index}
                            active={aResult.clienteId === clienteId}
                            vehiculo={{
                                id: aResult.id,
                                patente: aResult.patente,
                                year: aResult.year || "",
                                combustible: aResult.combustible || "",
                                cilindrada: aResult.cilindrada || "",
                                vin: aResult.vin || "",
                                clienteId: aResult.clienteId || 0,
                                createdAt: aResult.createdAt,
                                updatedAt: aResult.updatedAt,
                                modeloId: aResult.modeloId,
                            }}
                        />
                    )
                )}
        </>
    );
};

export default Recents;
