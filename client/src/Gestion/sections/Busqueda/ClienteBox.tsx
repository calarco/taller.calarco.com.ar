import React from "react";
import styled from "styled-components";

import { useActive } from "Gestion/context/activeContext";

const Container = styled.div`
    position: relative;
    width: 100%;
    transition: 0.1s ease-in;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-content: start;

    &:hover {
        cursor: pointer;
        background: var(--primary-variant);
        transition: 0.15s ease-out;
    }

    &:not(:first-child)::after {
        content: "";
        position: absolute;
        top: 0;
        z-index: 0;
        width: 100%;
        border-top: var(--border-variant);
    }

    > p {
        position: relative;
        width: 8.5rem;
        text-align: center;
        text-transform: uppercase;
        font-family: var(--font-family-alt);
        color: var(--on-background-variant);

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            right: 0;
            height: 2rem;
            border-right: var(--border-variant);
        }
    }

    h4 {
        padding: 1.5rem 2.5rem;
    }
`;

type ComponentProps = {
    cliente: Cliente;
};

const ClienteBox = function ({ cliente }: ComponentProps) {
    const { setClienteId, setVehiculoId } = useActive();

    return (
        <Container
            onClick={() => {
                setClienteId(cliente.id);
                setVehiculoId(0);
            }}
        >
            <p>
                {cliente.updatedAt.substring(8, 10)}
                <span>
                    {new Date(cliente.updatedAt)
                        .toLocaleDateString("default", {
                            month: "short",
                        })
                        .substring(0, 3)}
                </span>
            </p>
            <h4>
                {cliente.nombre} {cliente.apellido}
            </h4>
        </Container>
    );
};

export default ClienteBox;
