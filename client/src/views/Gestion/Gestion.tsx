import React, { useState } from "react";
import styled from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import { Device } from "components/globalStyle";
import { Busqueda } from "./Busqueda";
import { Clientes } from "./Clientes";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";

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

const Gestion = function ({ matchModelo }) {
    const nodeRef = React.useRef(null);
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [active, setActive] = useState("");

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
                                        <Reparaciones
                                            active={active}
                                            setActive={setActive}
                                            clienteId={clienteId}
                                            setClienteId={setClienteId}
                                            vehiculoId={vehiculoId}
                                            setVehiculoId={setVehiculoId}
                                            matchModelo={matchModelo}
                                            state={state}
                                        />
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
                                        <Vehiculos
                                            active={active}
                                            setActive={setActive}
                                            clienteId={clienteId}
                                            setClienteId={setClienteId}
                                            vehiculoId={vehiculoId}
                                            setVehiculoId={setVehiculoId}
                                            matchModelo={matchModelo}
                                            state={state}
                                        />
                                    ) : (
                                        <div>Presupuestos</div>
                                    )}
                                    <Clientes
                                        active={active}
                                        setActive={setActive}
                                        clienteId={clienteId}
                                        setClienteId={setClienteId}
                                        vehiculoId={vehiculoId}
                                        setVehiculoId={setVehiculoId}
                                        matchModelo={matchModelo}
                                        state={state}
                                    />
                                </>
                            )}
                        </Transition>
                    </SwitchTransition>
                </div>
            </Container>
        </>
    );
};

export default Gestion;
