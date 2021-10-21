import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { Device } from "components/globalStyle";
import { useGestion } from "./context";
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

    @media ${Device.desktop} {
        padding: 1.5rem 2rem;
        gap: 2rem;
    }
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
    const { clienteId, activeCard, setActiveCard } = useGestion();
    const [createCliente, setCreateCliente] = useState(false);
    const [createPresupuesto, setCreatePresupuesto] = useState(false);

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

    const matchModelo = (modeloId: number) => {
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
        activeCard !== "Cliente" && setCreateCliente(false);
        activeCard !== "Presupuesto" && setCreatePresupuesto(false);
    }, [activeCard]);

    useEffect(() => {
        createCliente ? setActiveCard("Cliente") : setActiveCard("");
    }, [createCliente, setActiveCard]);

    useEffect(() => {
        createPresupuesto ? setActiveCard("Presupuesto") : setActiveCard("");
    }, [createPresupuesto, setActiveCard]);

    return (
        <Container>
            <Panels>
                <Left>
                    <Busqueda
                        createCliente={createCliente}
                        setCreateCliente={setCreateCliente}
                        setCreatePresupuesto={setCreatePresupuesto}
                        matchModelo={matchModelo}
                    />
                    <Reparaciones />
                    <Presupuesto
                        edit={createPresupuesto}
                        unEdit={() => setCreatePresupuesto(false)}
                        matchModelo={matchModelo}
                    />
                </Left>
                <SwitchTransition>
                    {clienteId === 0 ? (
                        <Right key={0}>
                            <Turnos matchModelo={matchModelo} />
                            <Cliente createCliente={createCliente} />
                        </Right>
                    ) : (
                        <Right key={1}>
                            <Vehiculos matchModelo={matchModelo} />
                            <Cliente createCliente={createCliente} />
                        </Right>
                    )}
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
