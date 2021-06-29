import React, { useState, useCallback } from "react";
import feathersClient from "feathersClient";

import Section from "components/Section";

const Vehiculos = function ({
    active,
    setActive,
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
    matchModelo,
    state,
}) {
    const [vehiculos, setVehiculos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                patente: "",
                year: "",
                combustible: "",
                cilindrada: "",
                createdAt: "",
                updatedAt: "",
                clienteId: 0,
                modeloId: 0,
            },
        ],
    });

    const loadData = useCallback(() => {
        feathersClient
            .service("vehiculos")
            .find({
                query: {
                    $limit: 100,
                    clienteId: clienteId,
                    $sort: {
                        updatedAt: -1,
                    },
                },
            })
            .then((found) => {
                setVehiculos(found);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [clienteId]);

    return (
        <>
            <Section
                type="vehiculos"
                active={active}
                setActive={setActive}
                clienteId={clienteId}
                setClienteId={setClienteId}
                vehiculoId={vehiculoId}
                setVehiculoId={setVehiculoId}
                matchModelo={matchModelo}
                data={vehiculos.data}
                loadData={loadData}
                state={state}
            />
        </>
    );
};

export default Vehiculos;
