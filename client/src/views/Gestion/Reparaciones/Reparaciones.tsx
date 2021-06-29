import React, { useState, useCallback } from "react";
import feathersClient from "feathersClient";

import Section from "components/Section";

const Reparaciones = function ({
    active,
    setActive,
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
    matchModelo,
    state,
}) {
    const [reparaciones, setReparaciones] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                vehiculoId: "",
                reparacion: "",
                repuestos: "",
                labor: "",
                costo: "",
                km: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });

    const loadData = useCallback(() => {
        feathersClient
            .service("reparaciones")
            .find({
                query: {
                    vehiculoId: vehiculoId,
                    $limit: 100,
                    $sort: {
                        createdAt: -1,
                    },
                },
            })
            .then((found) => {
                setReparaciones(found);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [vehiculoId]);

    return (
        <>
            <Section
                type="reparaciones"
                active={active}
                setActive={setActive}
                clienteId={clienteId}
                setClienteId={setClienteId}
                vehiculoId={vehiculoId}
                setVehiculoId={setVehiculoId}
                matchModelo={matchModelo}
                data={reparaciones.data}
                loadData={loadData}
                state={state}
            />
        </>
    );
};

export default Reparaciones;
