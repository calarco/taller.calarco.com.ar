import React, { useState } from "react";
import styled from "styled-components";

import { Device } from "components/globalStyle";
import AppointmentsNew from "views/Gestion/GestionNew";
import { Busqueda } from "./Busqueda";
import Cliente from "./Cliente";
import { Vehiculos } from "./Vehiculos";
import { Reparaciones } from "./Reparaciones";

const Container = styled.main`
    width: 100%;
    max-height: 100vh;
    padding: 40px 40px 0 40px;
    display: grid;
    align-content: start;
    grid-template-columns: 2fr 3fr;
    grid-template-rows: auto auto;
    grid-template-areas:
        "cliente start "
        "vehiculos reparaciones ";

    @media ${Device.laptop} {
    }
`;

const Start = styled.div`
    grid-area: start;
    padding: 0 0 0 40px;
    display: grid;
    grid-template-rows: auto 1fr;
`;

const Gestion = function ({ setSnackbar, matchModelo }) {
    const [selected, setSelected] = useState({
        clienteId: 2,
        vehiculoId: 0,
        reparacionId: 0,
        form: "",
    });
    const [newOpen, setNewOpen] = useState(false);
    return (
        <>
            <Container>
                <Start>
                    <Busqueda
                        matchModelo={matchModelo}
                        setSelected={setSelected}
                    />
                    <button onClick={() => {}}>Nuevo Cliente</button>
                    <button onClick={() => {}}>Nuevo Presupuesto</button>
                </Start>
                <Cliente id={selected.clienteId} />
                <Vehiculos
                    matchModelo={matchModelo}
                    id={selected.clienteId}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Reparaciones selected={selected} setSelected={setSelected} />
            </Container>
            <AppointmentsNew
                newOpen={newOpen}
                setNewOpen={setNewOpen}
                setSnackbar={setSnackbar}
            />
        </>
    );
};

export default Gestion;
