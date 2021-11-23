import React, { startTransition } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";

import { useActive } from "Gestion/context/activeContext";

type Props = {
    readonly isActive?: boolean;
    readonly loading?: boolean;
};

const Container = styled.form<Props>`
    position: absolute;
    z-index: 500;
    top: 0;
    right: 0;
    left: 0;
    height: 3rem;
    border-radius: 4px 4px 0 0;
    overflow: hidden;
    background: var(--overlay);
    backdrop-filter: blur(0.4rem);
    display: grid;
    grid-template-columns: auto 1fr auto;
    transition: 0.15s ease-in;

    ${(props) =>
        props.isActive &&
        css`
            border-radius: 4px;
            background: var(--surface-t);
            box-shadow: var(--shadow);
            transition: 0.2s ease-out;
        `};

    input[type="search"] {
        margin: 0;
        border: none;
    }

    input[type="search"]:focus {
        border: none;
        box-shadow: none;
    }
`;

const FilterButton = styled.button`
    height: 100%;
    width: 8.5rem;
    padding: 0;
    border-radius: 4px 0 0 4px;
    border: none;
    color: var(--secondary);

    &::after {
        content: "";
        position: absolute;
        top: calc(50% - 1rem);
        right: 0;
        height: 2rem;
        border-right: 1px solid var(--secondary-variant);
    }
`;

const CreateButton = transition.button.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    height: 100%;
    padding: 0 1.5rem;
    margin: 0;
    border-radius: 0 4px 4px 0;
    border: none;
    color: var(--secondary);

    &::after {
        content: "";
        position: absolute;
        top: calc(50% - 1rem);
        left: 0;
        height: 2rem;
        border-left: 1px solid var(--secondary-variant);
    }
    
    &:enter {
        opacity: 0;
        transform: translateX(3rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transform: translateX(3rem);
        transition: 0.15s ease-in;
    }
`;

type ComponentProps = {
    busqueda: string;
    setBusqueda: (busqueda: string) => void;
    createCliente: boolean;
    setCreateCliente: (createCliente: boolean) => void;
    setCreatePresupuesto: (createPresupuesto: boolean) => void;
};

const Buscador = function ({
    busqueda,
    setBusqueda,
    createCliente,
    setCreateCliente,
    setCreatePresupuesto,
}: ComponentProps) {
    const { vehiculoId, setVehiculoId, presupuestoId, setPresupuestoId } =
        useActive();

    return (
        <Container
            autoComplete="off"
            isActive={vehiculoId === 0 && presupuestoId === 0 ? true : false}
        >
            <FilterButton
                type="button"
                onClick={() => setCreatePresupuesto(true)}
            >
                Presupuesto
            </FilterButton>
            <input
                type="search"
                name="search"
                placeholder="Buscar"
                onChange={(event) =>
                    startTransition(() => {
                        setBusqueda(event.target.value);
                    })
                }
                onFocus={() => {
                    setVehiculoId(0);
                    setPresupuestoId(0);
                }}
                value={busqueda}
                autoFocus
            />
            <CreateButton
                in={!createCliente}
                type="button"
                onClick={() => {
                    setCreateCliente(true);
                }}
            >
                Crear cliente
            </CreateButton>
        </Container>
    );
};

export default Buscador;
