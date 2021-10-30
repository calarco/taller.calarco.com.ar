import React, { MouseEvent } from "react";
import styled from "styled-components";

import { useCarName } from "Gestion/context/carNameContext";

const Container = styled.div`
    position: relative;
    width: 100%;
    transition: 0.1s ease-in;
    display: grid;
    grid-template-columns: auto 1fr auto;
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

    div {
        padding: 1.5rem 2.5rem;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        gap: 1rem;

        h4 {
            font: 400 1rem/1.75rem var(--font-family-alt);
        }
    }

    > h5 {
        padding: 0 2.5rem;
    }
`;

type ComponentProps = {
    presupuesto: Presupuesto;
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

const PresupuestoBox = function ({ presupuesto, onClick }: ComponentProps) {
    const { getCarName } = useCarName();

    return (
        <Container onClick={onClick}>
            <p>
                {presupuesto.updatedAt.substring(8, 10)}
                <span>
                    {new Date(presupuesto.updatedAt)
                        .toLocaleDateString("default", {
                            month: "short",
                        })
                        .substring(0, 3)}
                </span>
            </p>
            <div>
                <h4>{presupuesto.patente}</h4>
                <p>{getCarName(presupuesto.modeloId)}</p>
            </div>
            <h5>aoeu@aoeu.com</h5>
        </Container>
    );
};

export default PresupuestoBox;
