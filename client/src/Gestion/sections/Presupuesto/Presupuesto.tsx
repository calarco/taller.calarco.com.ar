import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import transition from "styled-transition-group";

import { useGestion } from "Gestion/gestionContext";
import usePresupuesto from "Gestion/hooks/usePresupuesto";
import SectionComponent from "components/Section";
import Mensaje from "./Mensaje";

const Container = transition(SectionComponent).attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
    position: absolute;
    z-index: 600;
    top: 3rem;
    right: 0;
    bottom: 0;
    left: 0;
    height: auto;
    overflow: overlay;
    border-radius: 4px;
    background: var(--surface);
    border-top: var(--border-variant);
    box-shadow: var(--shadow);
    display: grid;
    align-items: start;
    justify-items: center;
    gap: 0;

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
        transform: translateY(-1rem);
        transition: 0.15s ease-in;
    }
`;

const Buttons = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    border-radius: 4px;
    background: var(--overlay);
    backdrop-filter: blur(0.4rem);
    outline: 1px solid var(--primary-variant);
    box-shadow: var(--shadow);
    display: grid;
    grid-template-columns: 2fr 3fr 2fr;
    align-items: center;
    gap: 0.5rem;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        margin: 0;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;

        &:first-child::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            right: 0;
            height: 2rem;
            border-right: 1px solid var(--primary-variant);
        }
    }
`;

const Presupuesto = function () {
    const { activeCard, setActiveCard } = useGestion();
    const { presupuesto } = usePresupuesto();

    const [inputs, setInputs] = useState({
        email: "",
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <Container
            in={presupuesto.id !== 0}
            overlay={activeCard === "Presupuesto" ? true : false}
            onClick={() => {
                setActiveCard("");
            }}
        >
            <Buttons>
                <button type="button">Borrar</button>
                <input
                    type="email"
                    name="email"
                    placeholder="Direccion de correo"
                    value={inputs.email}
                    onChange={handleInputChange}
                />
                <button type="submit">Enviar</button>
            </Buttons>
            <Mensaje
                user={"montiel"}
                factura={"mezannotte"}
                presupuesto={presupuesto}
            />
        </Container>
    );
};

export default Presupuesto;
