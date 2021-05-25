import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import feathersClient from "feathersClient";

import Vehiculo from "./Vehiculo";

const Container = styled.section`
    grid-area: vehiculos;
    width: 100%;
    max-height: 100%;
    padding: 40px;
    border-radius: 0 0 0 2px;
    position: relative;
    background: var(--surface);
    box-shadow: var(--shadow0);
    border-top: var(--border-variant);
    border-left: var(--border);
`;

const Vehiculos = function ({ id, matchModelo, selected, setSelected }) {
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
                createdAt: "",
                updatedAt: "",
                clienteId: 0,
                modeloId: 0,
            },
        ],
    });

    const loadVehiculos = useCallback(() => {
        feathersClient
            .service("api/vehiculos")
            .find({
                query: {
                    $limit: 100,
                    clienteId: id,
                    $sort: {
                        updatedAt: -1,
                    },
                },
            })
            .then((vehiculos) => {
                setVehiculos(vehiculos);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    useEffect(() => {
        loadVehiculos();
        feathersClient
            .service("api/vehiculos")
            .on("created", () => loadVehiculos());
        feathersClient
            .service("api/vehiculos")
            .on("removed", () => loadVehiculos());
    }, [id, loadVehiculos]);

    useEffect(() => {
        selected.vehiculoId === 0 &&
            setSelected({
                clienteId: selected.clienteId,
                vehiculoId: vehiculos.data[0].id,
                reparacionId: "0",
                form: "",
            });
    }, [selected, vehiculos.data, setSelected]);

    return (
        <>
            <Container>
                {vehiculos.data.map((aVehiculo) => (
                    <Vehiculo
                        key={aVehiculo.id}
                        vehiculo={aVehiculo}
                        matchModelo={matchModelo}
                        onClick={() => {
                            setSelected({
                                clienteId: aVehiculo.clienteId,
                                vehiculoId: aVehiculo.id,
                                reparacionId: "0",
                                form: "",
                            });
                        }}
                        selected={selected}
                        setSelected={setSelected}
                    />
                ))}
            </Container>
        </>
    );
};

export default Vehiculos;
