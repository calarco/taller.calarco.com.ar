import React, { useState, useEffect, useCallback, useTransition } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import { Device } from "components/globalStyle";
import { Busqueda } from "./Busqueda";

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

const Loading = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background: var(--primary);
`;

const Gestion = function ({ matchModelo }) {
    const nodeRef = React.useRef(null);
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState(0);

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
                        matchModelo={matchModelo}
                        clienteId={clienteId}
                        setClienteId={setClienteId}
                        vehiculoId={vehiculoId}
                        setVehiculoId={setVehiculoId}
                    />
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
                                    {vehiculoId !== 0 && (
                                        <Section
                                            type="reparaciones"
                                            active={
                                                activeCard === "" ? true : false
                                            }
                                            onClick={() => {
                                                setActiveCard("");
                                            }}
                                            state={state}
                                        >
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
                                                        ? reparaciones.data[0]
                                                              .km
                                                        : "0",
                                                    createdAt:
                                                        new Date().toISOString(),
                                                    updatedAt: "",
                                                }}
                                                create={true}
                                                active={
                                                    reparaciones.data[0].id ===
                                                    0
                                                        ? true
                                                        : false
                                                }
                                                activeCard={activeCard}
                                                setActiveCard={setActiveCard}
                                                matchModelo={matchModelo}
                                                onClick={() => {}}
                                            />
                                            {reparaciones.data[0].id !== 0 &&
                                                reparaciones.data.map(
                                                    (aReparacion) => (
                                                        <Card
                                                            key={aReparacion.id}
                                                            type="Reparación"
                                                            data={aReparacion}
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
                                                        />
                                                    )
                                                )}
                                        </Section>
                                    )}
                                </>
                            )}
                        </Transition>
                    </SwitchTransition>
                </div>
                <div>
                    <SwitchTransition>
                        <Transition
                            nodeRef={nodeRef}
                            key={cliente.id}
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
                                    {clienteId !== 0 ? (
                                        <Section
                                            type="vehiculos"
                                            active={
                                                activeCard === "Vehículo" ||
                                                activeCard === "Cliente"
                                                    ? false
                                                    : true
                                            }
                                            onClick={() => {
                                                setActiveCard("");
                                            }}
                                            state={state}
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
