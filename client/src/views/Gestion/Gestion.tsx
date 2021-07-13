import React, { useState } from "react";
import styled from "styled-components";

import { Device } from "components/globalStyle";

import { Main } from "views/Gestion/Main";
import { Vehiculos } from "./Vehiculos";
import { Cliente } from "./Cliente";

const Container = styled.main`
    grid-area: gestion;
    width: 100%;
    height: 100vh;
    padding: 1.5rem 2rem;
    overflow: hidden;
    display: grid;
    gap: 2rem;
    grid-template-columns: 3fr 2fr;

    > div {
        position: relative;
        height: calc(100vh - 3rem);
        display: grid;
        grid-template-rows: auto 1fr;
    }

    @media ${Device.desktop} {
    }
`;

const Gestion = function ({ matchModelo }) {
    const [clienteId, setClienteId] = useState(0);
    const [vehiculoId, setVehiculoId] = useState(0);
    const [activeCard, setActiveCard] = useState("");

    return (
        <>
            <Container>
                <div>
                    <Main
                        clienteId={clienteId}
                        setClienteId={setClienteId}
                        vehiculoId={vehiculoId}
                        setVehiculoId={setVehiculoId}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                    />
                </div>
                <div>
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
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                    />
                </div>
            </Container>
        </>
    );
};

export default Gestion;
