import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";

import { useGestion } from "Gestion/gestionContext";
import Vehiculo from "./VehiculoBox";
import Presupuesto from "./PresupuestoBox";

const Recents = function () {
    const { clienteId, setPresupuestoId } = useGestion();

    const [result, setResult] = useState([
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
            clienteId: 0,
        },
    ]);

    function mergeSortedArray(listA, listB) {
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
            .then((vehiculos) => {
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
                    .then((presupuestos) => {
                        setResult(
                            mergeSortedArray(vehiculos.data, presupuestos.data)
                        );
                    })
                    .catch((error) => {
                        console.log("error", error);
                    });
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, []);

    return (
        <>
            {result[0] &&
                result[0].id !== 0 &&
                result.map((aResult, index) =>
                    aResult.repuestos ? (
                        <Presupuesto
                            key={index}
                            presupuesto={aResult}
                            onClick={() => {
                                setPresupuestoId(aResult.id);
                            }}
                        />
                    ) : (
                        <Vehiculo
                            key={index}
                            active={aResult.clienteId === clienteId}
                            vehiculo={aResult}
                        />
                    )
                )}
        </>
    );
};

export default Recents;
