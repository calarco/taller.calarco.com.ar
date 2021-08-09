import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly create?: boolean;
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly error?: boolean;
};

const Container = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    z-index: 1001;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 4px 4px 0 0;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(0.5rem);
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-rows: 1fr auto;
    transition: 0.25s ease-in;

    ${(props) =>
        props.active &&
        css`
            visibility: visible;
            opacity: 1;
            transition: 0.3s ease-in;
        `};
`;

const Buttons = styled.div<Props>`
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
        <Container active={remove}>
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
