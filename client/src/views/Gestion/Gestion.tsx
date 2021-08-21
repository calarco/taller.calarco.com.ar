import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Busqueda } from "./Busqueda";
import { Cliente } from "./Cliente";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";

const Container = styled.main`
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

const Panel = styled.div`
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
    const [activeCard, setActiveCard] = useState("Cliente");
    const [create, setCreate] = useState(true);

    useEffect(() => {
        clienteId === 0 && setCreate(true);
    }, [clienteId]);

    useEffect(() => {
        activeCard !== "Cliente" && setCreate(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Cliente") : setActiveCard("");
    }, [create, setActiveCard]);

    return (
        <Container>
            <Panels>
                <Panel>
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
                </Panel>
                <Panel>
                    {clienteId !== 0 && (
                        <Vehiculos
                            clienteId={clienteId}
                            vehiculoId={vehiculoId}
                            setVehiculoId={setVehiculoId}
                            activeCard={activeCard}
                            setActiveCard={setActiveCard}
                            matchModelo={matchModelo}
                        />
                    )}
                    <Cliente
                        clienteId={clienteId}
                        setClienteId={setClienteId}
                        setVehiculoId={setVehiculoId}
                        create={create}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                    />
                </Panel>
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
