import React, { useState, useEffect, startTransition } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import Vehiculo from "./Vehiculo";

type Props = {
    readonly active?: boolean;
    readonly loading?: boolean;
};

const Buscador = styled.form<Props>`
    grid-column-end: 1;
    grid-row-start: 1;
    width: 100%;
    height: 3rem;
    border-radius: 4px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
    transition: 0.15s ease-in;

    ${(props) =>
        props.active &&
        css`
            border-radius: 4px;
            background: var(--surface);
            box-shadow: var(--shadow);
            transition: 0.2s ease-out;
        `};

    input[type="search"] {
        margin: 0;
        border: none;
    }

    input[type="search"]:focus {
        border: none;
    }
`;

const CreateButton = transition.button.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    height: 100%;
    padding: 0 1.5rem;
    margin: 0;
    border-radius: 0 4px 4px 0;
    border: none;

    &::after {
        content: "";
        position: absolute;
        top: calc(50% - 1rem);
        left: 0;
        height: 2rem;
        border-left: var(--border-primary);
    }
    
    &:enter {
        opacity: 0;
        transform: translateX(3rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transform: translateX(3rem);
        transition: 0.15s ease-in;
    }
`;

const Container = transition.section.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    grid-column-end: 1;
    grid-row-start: 2;
    grid-row-end: 2;
    content-visibility: auto;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &:enter {
        opacity: 0;
    }

    &:enter-active {
        opacity: 1;
        transition: 0.3s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transition: 0.15s ease-in;
    }
`;

const Empty = styled.h5`
    padding: 2rem;
    text-align: center;
    color: var(--on-background-variant);
`;

const Cliente = styled.div`
    position: relative;
    width: 100%;
    padding: 1.5rem 2.5rem;
    transition: 0.1s ease-in;
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
    align-items: center;
    justify-content: start;

    &:hover {
        cursor: pointer;
        background: var(--primary-variant);
        transition: 0.15s ease-out;
    }

    &:not(:first-child)::after {
        content: "";
        position: absolute;
        top: 0;
        z-index: 0;
        width: 100%;
        border-top: var(--border-variant);
    }
`;

const Busqueda = function ({
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
    create,
    setCreate,
    matchModelo,
}) {
    const [count, setCount] = useState(0);
    const [busqueda, setBusqueda] = useState("");

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
                cilindrada: "",
                createdAt: "",
                updatedAt: "",
                clienteId: 0,
                modeloId: 0,
            },
        ],
    });

    useEffect(() => {
        busqueda === ""
            ? feathersClient
                  .service("clientes")
                  .find({
                      query: {
                          $limit: 50,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((clientes) => {
                      setCount((count) => count + 1);
                      setClientes(clientes);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  }) &&
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
                      setCount((count) => count + 1);
                      setVehiculos(vehiculos);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  })
            : feathersClient
                  .service("clientes")
                  .find({
                      query: {
                          $or: [
                              { nombre: { $iLike: `${busqueda}%` } },
                              { apellido: { $iLike: `${busqueda}%` } },
                          ],
                          $limit: 10,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((clientes) => {
                      setCount((count) => count + 1);
                      setClientes(clientes);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  }) &&
              feathersClient
                  .service("vehiculos")
                  .find({
                      query: {
                          patente: { $iLike: `${busqueda}%` },
                          $limit: 10,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((vehiculos) => {
                      setCount((count) => count + 1);
                      setVehiculos(vehiculos);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  });
    }, [busqueda]);

    return (
        <>
            <Buscador
                autoComplete="off"
                active={vehiculoId === 0 ? true : false}
            >
                <input
                    type="search"
                    name="search"
                    placeholder="Buscar"
                    onChange={(event) =>
                        startTransition(() => {
                            setBusqueda(event.target.value);
                        })
                    }
                    onFocus={() => setVehiculoId(0)}
                    value={busqueda}
                    autoFocus
                />
                <CreateButton
                    in={!create}
                    type="button"
                    onClick={() => {
                        setCreate(true);
                    }}
                >
                    Crear cliente
                </CreateButton>
            </Buscador>
            <SwitchTransition>
                <Container key={count}>
                    {busqueda === "" ? (
                        vehiculos.data[0] &&
                        vehiculos.data[0].id !== 0 &&
                        vehiculos.data.map((aVehiculo) => (
                            <Vehiculo
                                key={aVehiculo.id}
                                active={aVehiculo.clienteId === clienteId}
                                vehiculo={aVehiculo}
                                setClienteId={setClienteId}
                                setVehiculoId={setVehiculoId}
                                matchModelo={matchModelo}
                            />
                        ))
                    ) : vehiculos.data[0] || clientes.data[0] ? (
                        <>
                            {vehiculos.data.map((aVehiculo) => (
                                <Vehiculo
                                    key={aVehiculo.id}
                                    vehiculo={aVehiculo}
                                    active={aVehiculo.clienteId === clienteId}
                                    setClienteId={setClienteId}
                                    setVehiculoId={setVehiculoId}
                                    matchModelo={matchModelo}
                                />
                            ))}
                            {clientes.data.map((aCliente) => (
                                <Cliente
                                    key={aCliente.id}
                                    onClick={() => {
                                        setClienteId(aCliente.id);
                                        setVehiculoId(0);
                                    }}
                                >
                                    <h4>
                                        {aCliente.nombre} {aCliente.apellido}
                                    </h4>
                                </Cliente>
                            ))}
                        </>
                    ) : (
                        <Empty>No se encontraron resultados</Empty>
                    )}
                </Container>
            </SwitchTransition>
        </>
    );
};

export default Busqueda;
