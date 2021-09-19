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

const Container = transition.section.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    content-visibility: auto;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    padding-top: 3rem;
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
    transition: 0.1s ease-in;
    display: grid;
    grid-template-columns: auto 1fr;
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

    > p {
        position: relative;
        width: 8.5rem;
        text-align: center;
        text-transform: uppercase;
        font-family: var(--font-family-alt);
        color: var(--on-background-variant);

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            right: 0;
            height: 2rem;
            border-right: var(--border-variant);
        }
    }

    h4 {
        padding: 1.5rem 2.5rem;
    }
`;

const Buscador = styled.form<Props>`
    position: absolute;
    z-index: 500;
    top: 0;
    width: 100%;
    height: 3rem;
    border-radius: 4px;
    backdrop-filter: blur(0.4rem);
    display: grid;
    grid-template-columns: auto 1fr auto;
    transition: 0.15s ease-in;

    ${(props) =>
        props.active &&
        css`
            border-radius: 4px;
            background: var(--surface-t);
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

const FilterButton = styled.button`
    height: 100%;
    width: 8.5rem;
    padding: 0;
    border-radius: 4px 0 0 4px;
    border: none;
    text-align: center;

    &::after {
        content: "";
        position: absolute;
        top: calc(50% - 1rem);
        right: 0;
        height: 2rem;
        border-right: 1px solid var(--secondary-variant);
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
    color: var(--secondary);

    &::after {
        content: "";
        position: absolute;
        top: calc(50% - 1rem);
        left: 0;
        height: 2rem;
        border-left: 1px solid var(--secondary-variant);
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
                                    <p>
                                        {aCliente.updatedAt.substring(8, 10)}
                                        <span>
                                            {new Date(aCliente.updatedAt)
                                                .toLocaleDateString("default", {
                                                    month: "short",
                                                })
                                                .substring(0, 3)}
                                        </span>
                                    </p>
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
            <Buscador
                autoComplete="off"
                active={vehiculoId === 0 ? true : false}
            >
                <FilterButton type="button">Vehiculos</FilterButton>
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
        </>
    );
};

export default Busqueda;
