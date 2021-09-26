import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { Busqueda } from "./Busqueda";
import { Cliente } from "./Cliente";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";
import { Turnos } from "./Turnos";
import { Presupuesto } from "./Presupuesto";

const Container = styled.main`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;
    justify-content: center;
    grid-template-rows: 1fr 1.75rem;
`;

const Panels = styled.div`
    width: 100vw;
    max-width: 95rem;
    height: 100%;
    padding: 1.5rem 2rem;
    overflow: hidden;
    display: grid;
    gap: 2rem;
    grid-template-columns: 3fr 2fr;
`;

const Left = styled.div`
    position: relative;
    height: calc(100vh - 4.75rem);
    border-radius: 4px;
    background: var(--surface-variant);
    border: var(--border-variant);
    box-shadow: var(--shadow-variant);
    display: grid;
    grid-template-rows: auto 1fr;
    transition: 0.2s ease-in-out;
`;

const Right = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    position: relative;
    height: calc(100vh - 4.75rem);
    border-radius: 4px;
    background: var(--surface-variant);
    border: var(--border-variant);
    box-shadow: var(--shadow-variant);
    display: grid;
    grid-template-rows: auto 1fr;
    
    &:enter {
        opacity: 0;
        transform: translateY(-1rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.3s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transform: translateY(1rem);
        transition: 0.2s ease-in;
    }
`;

const Bar = styled.div`
    width: 100%;
    border-radius: 4px 4px 0 0;
    background: var(--surface-variant);
    border-top: var(--border-variant);
    box-shadow: var(--shadow-variant);
    text-align: right;

    button {
        height: 100%;
        margin: 0;
        padding: 0.25rem 0.55rem;
        border: none;
        font: var(--label);
        font: 500 0.75rem/1.25rem var(--font-family);

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 0.5rem);
            left: 0;
            height: 1rem;
            border-left: var(--border);
        }
    }
`;

const Gestion = function ({ setUser, darkTheme, setDarkTheme }) {
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [presupuestoId, setPresupuestoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");
    const [create, setCreate] = useState(false);
    const [presupuesto, setPresupuesto] = useState(false);

    const [fabricantes, setFabricantes] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
    const [modelos, setModelos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
                fabricanteId: 0,
            },
        ],
    });

    function loadCars() {
        feathersClient
            .service("fabricantes")
            .find({
                query: {
                    $limit: 100,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found) => {
                found.data[0] && setFabricantes(found);
            })
            .catch((error) => {
                console.error(error);
            });
        feathersClient
            .service("modelos")
            .find({
                query: {
                    $limit: 200,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found) => {
                found.data[0] && setModelos(found);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const matchModelo = (modeloId) => {
        try {
            return (
                fabricantes.data.find(
                    ({ id }) =>
                        id ===
                        modelos.data.find(({ id }) => id === modeloId)!
                            .fabricanteId
                )!.nombre +
                " " +
                modelos.data.find(({ id }) => id === modeloId)!.nombre
            );
        } catch {
            return "error";
        }
    };

    useEffect(() => {
        loadCars();
        feathersClient.service("fabricantes").on("created", () => loadCars());
        feathersClient.service("modelos").on("created", () => loadCars());
    }, []);

    useEffect(() => {
        vehiculoId !== 0 && setPresupuestoId(0);
    }, [vehiculoId]);

    useEffect(() => {
        presupuestoId !== 0 && setVehiculoId(0);
    }, [presupuestoId]);

    useEffect(() => {
        activeCard !== "Cliente" && setCreate(false);
        activeCard !== "Presupuesto" && setPresupuesto(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Cliente") : setActiveCard("");
    }, [create, setActiveCard]);

    useEffect(() => {
        presupuesto ? setActiveCard("Presupuesto") : setActiveCard("");
    }, [presupuesto, setActiveCard]);

    return (
        <Container>
            <Panels>
                <Left>
                    <Busqueda
                        clienteId={clienteId}
                        setClienteId={setClienteId}
                        vehiculoId={vehiculoId}
                        setVehiculoId={setVehiculoId}
                        presupuestoId={presupuestoId}
                        setPresupuestoId={setPresupuestoId}
                        create={create}
                        setCreate={setCreate}
                        setPresupuesto={setPresupuesto}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                        matchModelo={matchModelo}
                    />
                    <Reparaciones
                        vehiculoId={vehiculoId}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                    />
                    <Presupuesto
                        presupuestoId={presupuestoId}
                        setPresupuestoId={setPresupuestoId}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                        edit={presupuesto}
                        unEdit={() => setPresupuesto(false)}
                        matchModelo={matchModelo}
                    />
                </Left>
                <SwitchTransition>
                    <Right key={clienteId !== 0 ? 0 : 1}>
                        {clienteId !== 0 ? (
                            <>
                                <Vehiculos
                                    clienteId={clienteId}
                                    vehiculoId={vehiculoId}
                                    setVehiculoId={setVehiculoId}
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                    matchModelo={matchModelo}
                                />
                                <Cliente
                                    clienteId={clienteId}
                                    setClienteId={setClienteId}
                                    setVehiculoId={setVehiculoId}
                                    create={create}
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                />
                            </>
                        ) : (
                            <>
                                <Turnos
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                    matchModelo={matchModelo}
                                />
                                <Cliente
                                    clienteId={clienteId}
                                    setClienteId={setClienteId}
                                    setVehiculoId={setVehiculoId}
                                    create={create}
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                />
                            </>
                        )}
                    </Right>
                </SwitchTransition>
            </Panels>
            <Bar>
                {darkTheme ? (
                    <button
                        type="button"
                        onClick={() => {
                            setDarkTheme(false);
                        }}
                    >
                        Tema Claro
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => {
                            setDarkTheme(true);
                        }}
                    >
                        Tema Oscuro
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        window.localStorage.removeItem("feathers-jwt");
                        setUser(null);
                    }}
                >
                    Cerrar sesión
                </button>
            </Bar>
        </Container>
    );
};

export default Gestion;
