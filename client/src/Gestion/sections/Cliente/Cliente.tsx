import React, { useState, useEffect } from "react";
import styled from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { useGestion } from "Gestion/gestionContext";
import useCliente from "Gestion/hooks/useCliente";
import Box from "./Box";
import ClienteForm from "Gestion/forms/ClienteForm";
import Remove from "components/Remove";

const Container = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    position: relative;
    top: 0;
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;

    &:enter {
        opacity: 0;
    }

    &:enter-active {
        opacity: 1;
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

const Buttons = styled.div`
    grid-row: 5;
    grid-column-start: 1;
    grid-column-end: span 3;
    position: relative;
    width: 100%;
    height: 3rem;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    border-bottom: 1px solid var(--primary-variant);
    display: flex;

    button {
        width: 100%;
        height: 3rem;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;
        border: none;

        &:not(:first-child)::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: 1px solid var(--primary-variant);
        }
    }
`;

type ComponentProps = {
    createCliente: boolean;
};

const Cliente = function ({ createCliente }: ComponentProps) {
    const {
        clienteId,
        setClienteId,
        setVehiculoId,
        activeCard,
        setActiveCard,
    } = useGestion();
    const { cliente } = useCliente();

    const [remove, setRemove] = useState(false);

    useEffect(() => {
        setRemove(false);
    }, [clienteId]);

    return (
        <Container in={cliente.id !== 0}>
            <SwitchTransition>
                <Container key={cliente.id}>
                    <Buttons>
                        <button
                            type="button"
                            onClick={() => {
                                setRemove(true);
                            }}
                        >
                            Borrar
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveCard("Cliente")}
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setClienteId(0);
                                setVehiculoId(0);
                            }}
                        >
                            Cerrar
                        </button>
                    </Buttons>
                    <Box cliente={cliente} />
                    {!createCliente && (
                        <ClienteForm
                            cliente={cliente}
                            edit={activeCard === "Cliente" ? true : false}
                            unEdit={() => {
                                setActiveCard("");
                            }}
                        />
                    )}
                    <Remove
                        id={cliente.id}
                        service="clientes"
                        remove={remove}
                        unRemove={() => {
                            setRemove(false);
                        }}
                    />
                </Container>
            </SwitchTransition>
        </Container>
    );
};

export default Cliente;
