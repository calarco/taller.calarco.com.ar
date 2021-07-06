import React, { useState, useEffect, useTransition } from "react";
import styled, { css } from "styled-components";
import feathersClient from "feathersClient";

type Props = {
    readonly type?: string;
    readonly active?: boolean;
    readonly state?: string;
};

const Resultados = styled.div<Props>`
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 2;
    visibility: hidden;
    opacity: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    transition: 0.1s ease-in;

    div {
        width: 100%;
    }

    ${(props) =>
        props.active &&
        css`
            visibility: visible;
            opacity: 1;
            transition: 0.2s ease-out;
        `};
`;

const Container = styled.form<Props>`
    grid-row-start: 1;
    width: 100%;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    background: var(--surface-variant);
    border: var(--border-variant);
    border-bottom: 1px solid rgba(0, 0, 0, 0);
    box-shadow: var(--shadow-variant);
    display: grid;
    grid-template-columns: 1fr auto;

    ${(props) =>
        props.active &&
        css`
            border-radius: 4px 4px 0 0;
            background: var(--surface);
            border: var(--border);
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

    button {
        height: 3rem;
        padding: 0 1.5rem;
        margin: 0;
        border: none;
        color: var(--secondary);

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: var(--border);
        }
    }

    &:focus-within + ${Resultados} {
        visibility: visible;
        opacity: 1;
        transition: 0.2s ease-out;
    }
`;

const Resultado = styled.div`
    width: 100%;
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid var(--on-background-disabled);
    transition: 0.1s ease-in;
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
    align-items: center;
    justify-content: start;

    &:hover {
        cursor: pointer;
        background: var(--on-background-disabled);
        transition: 0.15s ease-out;
    }

    h4 {
        text-align: right;
    }

    div {
        pointer-events: none;
        display: grid;
    }
`;

const Busqueda = function ({
    matchModelo,
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
}) {
    const [active, setActive] = useState(true);
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
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        vehiculoId === 0 ? setActive(true) : setActive(false);
    }, [vehiculoId]);

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
                      setClientes(clientes);
                      setVehiculos({
                          total: 0,
                          limit: 0,
                          skip: 0,
                          data: [],
                      });
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
                      setVehiculos(vehiculos);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  });
    }, [busqueda]);

    const handleInputChange = (event) => {
        event.persist();
        startTransition(() => {
            setBusqueda(event.target.value);
        });
    };

    return (
        <>
            <Resultados active={active}>
                {isPending ? " Loading..." : null}
                {vehiculos.data[0] && (
                    <div>
                        {vehiculos.data.map((aVehiculo) => (
                            <Resultado
                                key={aVehiculo.id}
                                onClick={() => {
                                    setClienteId(aVehiculo.clienteId);
                                    setVehiculoId(aVehiculo.id);
                                }}
                                tabIndex={0}
                            >
                                <h4>{aVehiculo.patente}</h4>
                                <div>
                                    <h6>{matchModelo(aVehiculo.modeloId)}</h6>
                                    <p>
                                        {aVehiculo.combustible}{" "}
                                        {aVehiculo.cilindrada}
                                        <small>{aVehiculo.year}</small>
                                    </p>
                                </div>
                            </Resultado>
                        ))}
                    </div>
                )}
                <div>
                    {clientes.data.map((aCliente) => (
                        <Resultado
                            key={aCliente.id}
                            onClick={() => {
                                setClienteId(aCliente.id);
                                setVehiculoId(0);
                            }}
                            tabIndex={0}
                        >
                            <h4>
                                {aCliente.nombre} {aCliente.apellido}
                            </h4>
                            <div>
                                <p>{aCliente.telefono}</p>
                            </div>
                        </Resultado>
                    ))}
                </div>
            </Resultados>
            <Container autoComplete="off" active={active}>
                <input
                    type="search"
                    name="search"
                    placeholder="Buscar"
                    onChange={handleInputChange}
                    onFocus={() => setVehiculoId(0)}
                    value={busqueda}
                    autoFocus
                />
                {clienteId !== 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            setClienteId(0);
                            setVehiculoId(0);
                            setBusqueda("");
                        }}
                    >
                        Crear cliente
                    </button>
                )}
            </Container>
        </>
    );
};

export default Busqueda;
