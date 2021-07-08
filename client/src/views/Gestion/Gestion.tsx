import React, { useState, useEffect, useCallback, useTransition } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import { Device } from "components/globalStyle";

import Section from "components/Section";
import Card from "components/Card";

const Container = styled.main`
    grid-area: gestion;
    position: relative;
    width: 100%;
    height: 100vh;
    padding: 1.5rem 2rem;
    overflow: hidden;
    display: grid;
    gap: 2rem;
    grid-template-columns: 3fr 2fr;

    > div {
        height: calc(100vh - 3rem);
        display: grid;
        grid-template-rows: auto 1fr;
    }

    @media ${Device.desktop} {
    }
`;

type Props = {
    readonly type?: string;
    readonly active?: boolean;
    readonly state?: string;
};

const Busqueda = styled.form<Props>`
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

const Loading = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background: var(--primary);
`;

const Gestion = function ({ matchModelo }) {
    const nodeRef = React.useRef(null);
    const [busqueda, setBusqueda] = useState("");
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState(0);

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

    const handleInputChange = (event) => {
        event.persist();
        startTransition(() => {
            setBusqueda(event.target.value);
        });
    };

    const loadCliente = useCallback(() => {
        feathersClient
            .service("clientes")
            .get(clienteId)
            .then((found) => {
                setCliente(found);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [clienteId]);

    const loadVehiculos = useCallback(() => {
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

    const loadReparaciones = useCallback(() => {
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
                found.data[0]
                    ? setReparaciones(found)
                    : setReparaciones({
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
            })
            .catch((error) => {
                console.log("error", error);
            });
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
                  });
    }, [busqueda]);

    useEffect(() => {
        feathersClient
            .service("vehiculos")
            .on("created", () => loadVehiculos());
        feathersClient
            .service("vehiculos")
            .on("patched", () => loadVehiculos());
        feathersClient
            .service("vehiculos")
            .on("removed", () => loadVehiculos());
    }, [loadVehiculos]);

    useEffect(() => {
        feathersClient
            .service("reparaciones")
            .on("created", () => loadReparaciones());
        feathersClient
            .service("reparaciones")
            .on("patched", () => loadReparaciones());
        feathersClient
            .service("reparaciones")
            .on("removed", () => loadReparaciones());
    }, [loadReparaciones]);

    useEffect(() => {
        clienteId !== 0 &&
            startTransition(() => {
                loadCliente();
            });
        clienteId !== 0 &&
            startTransition(() => {
                loadVehiculos();
            });
    }, [clienteId, startTransition, loadCliente, loadVehiculos]);

    useEffect(() => {
        vehiculoId !== 0 &&
            startTransition(() => {
                loadReparaciones();
            });
        setSelected(0);
    }, [vehiculoId, startTransition, loadReparaciones]);

    return (
        <>
            <Container>
                <div>
                    <Busqueda
                        autoComplete="off"
                        active={vehiculoId === 0 ? true : false}
                    >
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
                    </Busqueda>
                    <Section
                        primary={vehiculoId === 0 ? false : true}
                        active={activeCard === "" ? true : false}
                        onClick={() => {
                            setActiveCard("");
                        }}
                    >
                        <SwitchTransition>
                            <Transition
                                nodeRef={nodeRef}
                                key={reparaciones.data[0].id}
                                addEndListener={(nodeRef, done) => {
                                    nodeRef.addEventListener(
                                        "transitionend",
                                        done,
                                        false
                                    );
                                }}
                                unmountOnExit
                                mountOnEnter
                            >
                                {(state) => (
                                    <>
                                        {vehiculoId === 0 ? (
                                            <>
                                                {isPending
                                                    ? " Loading..."
                                                    : null}
                                                {clientes.data.map(
                                                    (aCliente) => (
                                                        <Resultado
                                                            key={aCliente.id}
                                                            onClick={() => {
                                                                setClienteId(
                                                                    aCliente.id
                                                                );
                                                                setVehiculoId(
                                                                    0
                                                                );
                                                            }}
                                                            tabIndex={0}
                                                        >
                                                            <h4>
                                                                {
                                                                    aCliente.nombre
                                                                }{" "}
                                                                {
                                                                    aCliente.apellido
                                                                }
                                                            </h4>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        aCliente.telefono
                                                                    }
                                                                </p>
                                                            </div>
                                                        </Resultado>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Card
                                                    type="Reparación"
                                                    data={{
                                                        id: 0,
                                                        vehiculoId: vehiculoId,
                                                        reparacion: "",
                                                        repuestos: "",
                                                        labor: "0",
                                                        costo: "0",
                                                        km: reparaciones.data[0]
                                                            ? reparaciones
                                                                  .data[0].km
                                                            : "0",
                                                        createdAt:
                                                            new Date().toISOString(),
                                                        updatedAt: "",
                                                    }}
                                                    create={true}
                                                    active={false}
                                                    activeCard={activeCard}
                                                    setActiveCard={
                                                        setActiveCard
                                                    }
                                                    matchModelo={matchModelo}
                                                    onClick={() => {}}
                                                    state={state}
                                                />
                                                {reparaciones.data[0].id !==
                                                    0 &&
                                                    reparaciones.data.map(
                                                        (aReparacion) => (
                                                            <Card
                                                                key={
                                                                    aReparacion.id
                                                                }
                                                                type="Reparación"
                                                                data={
                                                                    aReparacion
                                                                }
                                                                create={false}
                                                                active={
                                                                    selected ===
                                                                    aReparacion.id
                                                                        ? true
                                                                        : false
                                                                }
                                                                activeCard={
                                                                    activeCard
                                                                }
                                                                setActiveCard={
                                                                    setActiveCard
                                                                }
                                                                matchModelo={
                                                                    matchModelo
                                                                }
                                                                onClick={() => {
                                                                    setSelected(
                                                                        aReparacion.id
                                                                    );
                                                                }}
                                                                state={state}
                                                            />
                                                        )
                                                    )}
                                            </>
                                        )}
                                    </>
                                )}
                            </Transition>
                        </SwitchTransition>
                    </Section>
                </div>
                <div>
                    <SwitchTransition>
                        <Transition
                            nodeRef={nodeRef}
                            key={clienteId}
                            addEndListener={(nodeRef, done) => {
                                nodeRef.addEventListener(
                                    "transitionend",
                                    done,
                                    false
                                );
                            }}
                        >
                            {(state) => (
                                <>
                                    {clienteId !== 0 ? (
                                        <Section
                                            primary={false}
                                            active={
                                                activeCard === "Vehículo" ||
                                                activeCard === "Cliente"
                                                    ? false
                                                    : true
                                            }
                                            onClick={() => {
                                                setActiveCard("");
                                            }}
                                        >
                                            <Card
                                                type="Vehículo"
                                                data={{
                                                    id: 0,
                                                    patente: "",
                                                    year: "",
                                                    combustible: "Nafta",
                                                    cilindrada: "",
                                                    createdAt: "",
                                                    updatedAt: "",
                                                    clienteId: clienteId,
                                                    modeloId: 0,
                                                }}
                                                create={true}
                                                active={
                                                    !vehiculos.data[0]
                                                        ? true
                                                        : false
                                                }
                                                activeCard={activeCard}
                                                setActiveCard={setActiveCard}
                                                matchModelo={matchModelo}
                                                onClick={() => setVehiculoId(0)}
                                                state={state}
                                            />
                                            {vehiculos.data[0] &&
                                                vehiculos.data.map(
                                                    (aVehiculo) => (
                                                        <Card
                                                            key={aVehiculo.id}
                                                            type="Vehículo"
                                                            data={aVehiculo}
                                                            create={false}
                                                            active={
                                                                vehiculoId ===
                                                                aVehiculo.id
                                                                    ? true
                                                                    : false
                                                            }
                                                            activeCard={
                                                                activeCard
                                                            }
                                                            setActiveCard={
                                                                setActiveCard
                                                            }
                                                            matchModelo={
                                                                matchModelo
                                                            }
                                                            onClick={() =>
                                                                setVehiculoId(
                                                                    aVehiculo.id
                                                                )
                                                            }
                                                            state={state}
                                                        />
                                                    )
                                                )}
                                        </Section>
                                    ) : (
                                        <div>Presupuestos</div>
                                    )}
                                    {clienteId === 0 ? (
                                        <Card
                                            type="Cliente"
                                            data={{
                                                id: 0,
                                                nombre: "",
                                                apellido: "",
                                                dni: "",
                                                empresa: "",
                                                telefono: "",
                                                email: "",
                                                createdAt: "",
                                                updatedAt: "",
                                            }}
                                            create={true}
                                            active={true}
                                            activeCard={activeCard}
                                            setActiveCard={setActiveCard}
                                            matchModelo={matchModelo}
                                            onClick={() => {}}
                                            state={state}
                                        />
                                    ) : (
                                        <Card
                                            type="Cliente"
                                            data={cliente}
                                            create={false}
                                            active={true}
                                            activeCard={activeCard}
                                            setActiveCard={setActiveCard}
                                            matchModelo={matchModelo}
                                            onClick={() => {}}
                                            state={state}
                                        />
                                    )}
                                </>
                            )}
                        </Transition>
                    </SwitchTransition>
                </div>
            </Container>
            {isPending ? <Loading /> : null}
        </>
    );
};

export default Gestion;
