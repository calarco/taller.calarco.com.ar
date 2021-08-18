import React from "react";
import styled from "styled-components";
import transition from "styled-transition-group";

const Container = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    position: absolute;
    z-index: 1001;
    top: -1px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(0.5rem);
    border: 1px solid var(--error);
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-rows: 1fr auto;
    transition: 0.25s ease-in;

    &:enter {
        opacity: 0;
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
        transition: 0.15s ease-in;
    }
`;

const Buttons = styled.div`
    width: 100%;
    height: 3rem;
    overflow: hidden;
    background: var(--surface);
    border-top: var(--border);
    display: flex;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        margin: 0;
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
            border-left: var(--border);
        }
    }
`;

const VehiculoForm = function ({ remove, unRemove, handleDelete, children }) {
    return (
        <Container in={remove}>
            <h5>{children}</h5>
            <Buttons>
                <button type="button" onClick={unRemove}>
                    Cancelar
                </button>
                <button type="reset" onClick={handleDelete}>
                    Borrar
                </button>
            </Buttons>
        </Container>
    );
};

export default VehiculoForm;
