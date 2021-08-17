import React, { useState, useEffect, useTransition } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, Transition } from "react-transition-group";

import { Busqueda } from "./Busqueda";
import { Cliente } from "./Cliente";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";

type Props = {
    readonly active?: boolean;
};

const Container = styled.main<Props>`
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr 1.75rem;
`;

const Panels = styled.div`
    width: 100%;
    height: 100%;
    padding: 1.5rem 2rem;
    overflow: hidden;
    display: grid;
    gap: 2rem;
    grid-template-columns: 3fr 2fr;
    will-change: opacity;
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
`;

const Right = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
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
        transform: translateX(-1rem);
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
        transition: 0.15s ease-in;
    }
`;

const Buscador = styled.form<Props>`
    grid-row-start: 1;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr auto;

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

const Loading = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background: var(--primary);
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
    const nodeRef = React.useRef(null);
    const [isPending, startTransition] = useTransition();
    const [busqueda, setBusqueda] = useState("");
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");
    const [create, setCreate] = useState(false);

    const handleInputChange = (event) => {
        event.persist();
        startTransition(() => {
            setBusqueda(event.target.value);
        });
    };

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
                    <Buscador
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
                        {clienteId !== 0 && !create ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setCreate(true);
                                }}
                            >
                                Crear cliente
                            </button>
                        ) : clienteId !== 0 && create ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setCreate(false);
                                }}
                            >
                                Cancelar
                            </button>
                        ) : undefined}
                    </Buscador>
                    <SwitchTransition>
                        <Transition
                            nodeRef={nodeRef}
                            key={vehiculoId === 0 ? 0 : 1}
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
                                        <Busqueda
                                            busqueda={busqueda}
                                            setClienteId={setClienteId}
                                            setVehiculoId={setVehiculoId}
                                            matchModelo={matchModelo}
                                            state={state}
                                        />
                                    ) : (
                                        <Reparaciones
                                            vehiculoId={vehiculoId}
                                            activeCard={activeCard}
                                            setActiveCard={setActiveCard}
                                            state={state}
                                        />
                                    )}
                                </>
                            )}
                        </Transition>
                    </SwitchTransition>
                    {isPending ? <Loading /> : null}
                </Left>
                <SwitchTransition>
                    <Right key={clienteId}>
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
                            setCreate={setCreate}
                            activeCard={activeCard}
                            setActiveCard={setActiveCard}
                        />
                    </Right>
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
