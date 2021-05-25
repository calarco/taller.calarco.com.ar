import React, { useState, useEffect } from "react";
import styled from "styled-components";
import feathersClient from "feathersClient";

import { Spinner } from "components/components";
import Resultado from "./Resultado";

const Resultados = styled.div`
    position: absolute;
    top: 100;
    left: 0;
    right: 0;
    padding: inherit;
    z-index: 100;
    width: 100%;
    background: var(--surface);
    box-shadow: var(--shadow0);
    visibility: hidden;
    opacity: 0;
    max-height: 0;
    overflow-y: auto;
    transition: 0.1s ease-in;
`;

const Container = styled.form`
    grid-column-end: span 2;
    position: relative;
    width: 100%;

    input[type="search"] {
        border-radius: 4px;
        background: var(--surface);
        box-shadow: var(--shadow0);
        border: var(--border);
    }

    &:focus-within ${Resultados} {
        visibility: visible;
        opacity: 1;
        max-height: calc(100vh - 100px);
        transition: 0.2s ease-out;
    }
`;

const Busqueda = function ({ matchModelo, setSelected }) {
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState({ search: "" });
    const [clientes, setClientes] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                apellido: "",
                telefono: " ",
                direccion: "",
                empresa: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
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

    useEffect(() => {
        const updateSearch = (text) => {
            if (text === undefined) {
                setBusqueda((busqueda) => ({
                    ...busqueda,
                }));
            } else if (text === false) {
                setBusqueda({ search: "" });
            } else {
                setBusqueda({ search: text });
            }
        };
        feathersClient
            .service("api/clientes")
            .on("created", () => updateSearch(false));
        feathersClient
            .service("api/clientes")
            .on("patched", () => updateSearch(undefined));
        feathersClient
            .service("api/clientes")
            .on("removed", () => updateSearch(undefined));
        feathersClient
            .service("api/vehiculos")
            .on("created", () => updateSearch(undefined));
        feathersClient
            .service("api/vehiculos")
            .on("patched", () => updateSearch(undefined));
        feathersClient
            .service("api/vehiculos")
            .on("removed", () => updateSearch(undefined));
    }, []);

    useEffect(() => {
        setLoading(true);
        if (!busqueda.search) {
            setClientes({
                total: 0,
                limit: 0,
                skip: 0,
                data: [],
            });
            setVehiculos({
                total: 0,
                limit: 0,
                skip: 0,
                data: [],
            });
            setLoading(false);
            return;
        } else {
            feathersClient
                .service("api/clientes")
                .find({
                    query: {
                        $or: [
                            { nombre: { $iLike: `${busqueda.search}%` } },
                            { apellido: { $iLike: `${busqueda.search}%` } },
                        ],
                        $limit: 10,
                        $sort: {
                            updatedAt: -1,
                        },
                    },
                })
                .then((clientes) => {
                    setClientes(clientes);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("error", error);
                });
            feathersClient
                .service("api/vehiculos")
                .find({
                    query: {
                        patente: { $iLike: `${busqueda.search}%` },
                        $limit: 10,
                        $sort: {
                            updatedAt: -1,
                        },
                    },
                })
                .then((vehiculos) => {
                    setVehiculos(vehiculos);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log("error", error);
                });
            return;
        }
    }, [busqueda]);

    const handleInputChange = (event) => {
        event.persist();
        setBusqueda({
            search: event.target.value,
        });
    };

    return (
        <>
            <Container autoComplete="off">
                <input
                    type="search"
                    name="search"
                    placeholder="Buscar"
                    onChange={handleInputChange}
                    value={busqueda.search}
                    autoFocus
                />
                <Resultados>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            {vehiculos.data.map((aVehiculo) => (
                                <Resultado
                                    type="vehiculo"
                                    id={aVehiculo.id}
                                    h1={aVehiculo.patente}
                                    h2={aVehiculo.year}
                                    h3={matchModelo(aVehiculo.modeloId)}
                                    onClick={(e) => {
                                        setSelected({
                                            clienteId: aVehiculo.clienteId,
                                            vehiculoId: aVehiculo.id,
                                        });
                                        e.target.blur();
                                    }}
                                />
                            ))}
                            {clientes.data.map((aCliente) => (
                                <Resultado
                                    type="cliente"
                                    id={aCliente.id}
                                    h1={`${aCliente.nombre} ${aCliente.apellido}`}
                                    h2={aCliente.empresa}
                                    h3={aCliente.telefono}
                                    onClick={(e) => {
                                        setSelected({
                                            clienteId: aCliente.id,
                                            vehiculoId: 0,
                                        });
                                        e.target.blur();
                                    }}
                                />
                            ))}
                        </>
                    )}
                </Resultados>
            </Container>
        </>
    );
};

export default Busqueda;
