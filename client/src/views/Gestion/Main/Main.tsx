import React, { useState, useEffect, useCallback, useTransition } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import Section from "components/Section";
import Card from "components/Card";
import ReparacionBox from "views/Gestion/Main/Reparaciones/ReparacionBox";
import ReparacionForm from "views/Gestion/Main/Reparaciones/ReparacionForm";

const Container = styled.div`
    position: relative;
    height: calc(100vh - 3rem);
    display: grid;
    grid-template-rows: auto 1fr;
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
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background: var(--primary);
`;

const Main = function ({
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
    activeCard,
    setActiveCard,
    setCreateClient,
}) {
    const nodeRef = React.useRef(null);
    const [busqueda, setBusqueda] = useState("");
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState(0);
    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

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
                  .then(() => {})
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
        vehiculoId !== 0 &&
            startTransition(() => {
                loadReparaciones();
            });
        setSelected(0);
    }, [vehiculoId, startTransition, loadReparaciones]);

    useEffect(() => {
        setRemove(false);
    }, [selected]);

    useEffect(() => {
        activeCard !== "Reparación" && setCreate(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Reparación") : setActiveCard("");
    }, [create, setActiveCard]);

    return (
        <>
            <Container>
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
                                setCreateClient(true);
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
                                            {isPending ? " Loading..." : null}
                                            {clientes.data.map((aCliente) => (
                                                <Resultado
                                                    key={aCliente.id}
                                                    onClick={() => {
                                                        setClienteId(
                                                            aCliente.id
                                                        );
                                                        setVehiculoId(0);
                                                    }}
                                                    tabIndex={0}
                                                >
                                                    <h4>
                                                        {aCliente.nombre}{" "}
                                                        {aCliente.apellido}
                                                    </h4>
                                                    <div>
                                                        <p>
                                                            {aCliente.telefono}
                                                        </p>
                                                    </div>
                                                </Resultado>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            <Card
                                                type="Reparación"
                                                create={true}
                                                active={false}
                                                edit={
                                                    activeCard ===
                                                        "Reparación" && create
                                                        ? true
                                                        : false
                                                }
                                                onEdit={() => setCreate(true)}
                                                onRemove={() => {
                                                    setRemove(true);
                                                }}
                                                state={state}
                                            >
                                                <ReparacionForm
                                                    reparacion={{
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
                                                    edit={
                                                        activeCard ===
                                                            "Reparación" &&
                                                        create
                                                            ? true
                                                            : false
                                                    }
                                                    unEdit={() => {
                                                        setActiveCard("");
                                                    }}
                                                    remove={remove}
                                                    unRemove={() => {
                                                        setRemove(false);
                                                    }}
                                                />
                                            </Card>
                                            {reparaciones.data[0].id !== 0 &&
                                                reparaciones.data.map(
                                                    (aReparacion) => (
                                                        <Card
                                                            key={aReparacion.id}
                                                            type="Reparación"
                                                            create={false}
                                                            active={
                                                                selected ===
                                                                aReparacion.id
                                                                    ? true
                                                                    : false
                                                            }
                                                            edit={
                                                                selected ===
                                                                    aReparacion.id &&
                                                                activeCard ===
                                                                    "Reparación" &&
                                                                !create
                                                                    ? true
                                                                    : false
                                                            }
                                                            onEdit={() =>
                                                                setActiveCard(
                                                                    "Reparación"
                                                                )
                                                            }
                                                            onRemove={() => {
                                                                setRemove(true);
                                                            }}
                                                            state={state}
                                                        >
                                                            <ReparacionBox
                                                                reparacion={
                                                                    aReparacion
                                                                }
                                                                onClick={() => {
                                                                    setSelected(
                                                                        aReparacion.id
                                                                    );
                                                                }}
                                                            />
                                                            {selected ===
                                                                aReparacion.id && (
                                                                <ReparacionForm
                                                                    reparacion={
                                                                        aReparacion
                                                                    }
                                                                    edit={
                                                                        activeCard ===
                                                                            "Reparación" &&
                                                                        !create
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    unEdit={() => {
                                                                        setActiveCard(
                                                                            ""
                                                                        );
                                                                    }}
                                                                    remove={
                                                                        remove
                                                                    }
                                                                    unRemove={() => {
                                                                        setRemove(
                                                                            false
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </Card>
                                                    )
                                                )}
                                        </>
                                    )}
                                </>
                            )}
                        </Transition>
                    </SwitchTransition>
                </Section>
                {isPending ? <Loading /> : null}
            </Container>
        </>
    );
};

export default Main;
