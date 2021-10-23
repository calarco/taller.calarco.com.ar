import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Device } from "components/globalStyle";
import { useGestion } from "Gestion/gestionContext";
import { CarNameProvider } from "Gestion/carNameContext";
import { Busqueda } from "./Busqueda";
import { Cliente } from "./Cliente";
import ClienteForm from "./Cliente/Form";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";
import { Turnos } from "./Turnos";
import { Presupuesto } from "./Presupuesto";
import PresupuestoForm from "./Presupuesto/Form";
import Bar from "./Bar";

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
    display: grid;
    gap: 2rem;
    grid-template-columns: 3fr 2fr;

    @media ${Device.desktop} {
        padding: 1.5rem 2rem;
        gap: 2rem;
    }
`;

const Panel = styled.div`
    position: relative;
    height: calc(100vh - 4.75rem);
    border-radius: 4px;
    background: var(--surface-variant);
    outline: var(--border-variant);
    outline-offset: 0px;
    box-shadow: var(--shadow-variant);
    display: grid;
    grid-template-rows: auto 1fr;
`;

const Side = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-rows: auto 1fr;
`;

const Gestion = function ({ setUser, darkTheme, setDarkTheme }) {
    const { clienteId, activeCard, setActiveCard } = useGestion();

    const [createCliente, setCreateCliente] = useState(false);
    const [createPresupuesto, setCreatePresupuesto] = useState(false);

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
        <CarNameProvider>
            <Container>
                <Panels>
                    <Panel>
                        <Busqueda
                            createCliente={createCliente}
                            setCreateCliente={setCreateCliente}
                            setCreatePresupuesto={setCreatePresupuesto}
                        />
                        <Reparaciones />
                        <Presupuesto />
                        <PresupuestoForm
                            edit={createPresupuesto}
                            unEdit={() => {
                                setActiveCard("");
                            }}
                        />
                    </Panel>
                    <Panel>
                        <Turnos overlay={clienteId !== 0} />
                        {clienteId !== 0 && (
                            <Side>
                                <Vehiculos />
                                <Cliente createCliente={createCliente} />
                            </Side>
                        )}
                        <ClienteForm
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
                            edit={createCliente}
                            unEdit={() => {
                                setActiveCard("");
                            }}
                        />
                    </Panel>
                </Panels>
                <Bar
                    setUser={setUser}
                    darkTheme={darkTheme}
                    setDarkTheme={setDarkTheme}
                />
            </Container>
        </CarNameProvider>
    );
};

export default Gestion;
