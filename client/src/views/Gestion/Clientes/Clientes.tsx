import React, { useState, useCallback } from "react";
import feathersClient from "feathersClient";

import Section from "components/Section";

const Clientes = function ({
    active,
    setActive,
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
    matchModelo,
    state,
}) {
    const [cliente, setCliente] = useState({
        id: 0,
        nombre: "",
        apellido: "",
        telefono: " ",
        direccion: "",
        empresa: "",
        createdAt: "",
        updatedAt: "",
    });

    const loadData = useCallback(() => {
        feathersClient
            .service("clientes")
            .get(clienteId)
            .then((cliente) => {
                setCliente(cliente);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [clienteId]);

    return (
        <>
            <Section
                type="clientes"
                active={active}
                setActive={setActive}
                clienteId={clienteId}
                setClienteId={setClienteId}
                vehiculoId={vehiculoId}
                setVehiculoId={setVehiculoId}
                matchModelo={matchModelo}
                data={cliente}
                loadData={loadData}
                state={state}
            />
        </>
    );
};

export default Clientes;
