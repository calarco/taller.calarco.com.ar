import React, { useState, useEffect } from "react";
import styled from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { Busqueda } from "./Busqueda";
import { Turnos } from "./Turnos";
import { Cliente } from "./Cliente";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";

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
        transition: 0.2s ease-in;
    }
`;

const Right1 = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    position: relative;
    height: calc(100vh - 4.75rem);
    border-radius: 4px;
    background: var(--surface);
    border: var(--border);
    box-shadow: var(--shadow);
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
        transition: 0.2s ease-in;
    }
`;

const Bar = styled.div`
    width: 100%;
    background: var(--surface);
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

const Gestion = function ({ setUser, matchModelo }) {
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");
    const [create, setCreate] = useState(false);

    useEffect(() => {
        activeCard !== "Cliente" && setCreate(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Cliente") : setActiveCard("");
    }, [create, setActiveCard]);

    return (
        <Container>
            <Panels>
                <Left>
                    <Busqueda
                        clienteId={clienteId}
                        setClienteId={setClienteId}
                        vehiculoId={vehiculoId}
                        setVehiculoId={setVehiculoId}
                        create={create}
                        setCreate={setCreate}
                        matchModelo={matchModelo}
                    />
                    <Reparaciones
                        vehiculoId={vehiculoId}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                    />
                </Left>
                <SwitchTransition>
                    {clienteId !== 0 ? (
                        <Right key={0}>
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
                        </Right>
                    ) : (
                        <Right1 key={1}>
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
                        </Right1>
                    )}
                </SwitchTransition>
            </Panels>
            <Bar>
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
