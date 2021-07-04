import React, { useState, useEffect, useCallback, useTransition } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import { Device } from "components/globalStyle";
import { Busqueda } from "./Busqueda";
import Section from "components/Section";
import Cliente from "views/Gestion/Clientes/Cliente";
import Vehiculo from "views/Gestion/Vehiculos/Vehiculo";
import Reparacion from "views/Gestion/Reparaciones/Reparacion";

const Container = styled.main`
    grid-area: gestion;
    position: relative;
    width: 100%;
    max-height: 100vh;
    padding: 1.5rem 2rem;
    overflow: hidden;
    display: grid;
    gap: 2rem;
    grid-template-columns: 3fr 2fr;

    > div {
        grid-row-end: 1;
        height: 100%;
        overflow: hidden;
        border-radius: 4px;
        background: var(--surface-variant);
        border: var(--border-variant);
        box-shadow: var(--shadow-variant);
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
                setReparaciones(found);
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
                            key={vehiculoId}
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
                                            <Reparacion
                                                active={
                                                    !reparaciones.data[0]
                                                        ? true
                                                        : false
                                                }
                                                activeCard={activeCard}
                                                setActiveCard={setActiveCard}
                                                setActiveId={setSelected}
                                                reparacion={{
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
                                                matchModelo={matchModelo}
                                            />
                                            {reparaciones.data[0] &&
                                                reparaciones.data.map(
                                                    (aReparacion) => (
                                                        <Reparacion
                                                            key={aReparacion.id}
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
                                                            setActiveId={
                                                                setSelected
                                                            }
                                                            reparacion={
                                                                aReparacion
                                                            }
                                                            matchModelo={
                                                                matchModelo
                                                            }
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
                            key={clienteId}
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
                                            <Vehiculo
                                                active={
                                                    !vehiculos.data[0]
                                                        ? true
                                                        : false
                                                }
                                                activeCard={activeCard}
                                                setActiveCard={setActiveCard}
                                                setActiveId={setVehiculoId}
                                                onClick={() => setVehiculoId(0)}
                                                matchModelo={matchModelo}
                                                vehiculo={{
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
                                            />
                                            {vehiculos.data[0] &&
                                                vehiculos.data.map(
                                                    (aVehiculo) => (
                                                        <Vehiculo
                                                            key={aVehiculo.id}
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
                                                            setActiveId={
                                                                setVehiculoId
                                                            }
                                                            onClick={() =>
                                                                setVehiculoId(
                                                                    aVehiculo.id
                                                                )
                                                            }
                                                            matchModelo={
                                                                matchModelo
                                                            }
                                                            vehiculo={aVehiculo}
                                                        />
                                                    )
                                                )}
                                        </Section>
                                    ) : (
                                        <div>Presupuestos</div>
                                    )}
                                    {clienteId === 0 ? (
                                        <Cliente
                                            activeCard={activeCard}
                                            setActiveCard={setActiveCard}
                                            setActiveId={setClienteId}
                                            cliente={{
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
                                            matchModelo={matchModelo}
                                        />
                                    ) : (
                                        <Cliente
                                            activeCard={activeCard}
                                            setActiveCard={setActiveCard}
                                            setActiveId={setClienteId}
                                            cliente={cliente}
                                            matchModelo={matchModelo}
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
