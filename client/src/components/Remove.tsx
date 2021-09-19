import React from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";

type Props = {
    inline?: boolean;
};

const Container = transition.div<Props>`
    position: absolute;
    z-index: 1001;
    top: -1px;
    right: -1px;
    bottom: -1px;
    left: -1px;
    min-height: 3rem;
    border-radius: 4px;
    overflow: hidden;
    background: var(--surface-t);
    backdrop-filter: blur(0.5rem) saturate(0);
    border: 1px solid var(--error);
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-rows: 1fr auto;
    transition: 0.25s ease-in;

    ${(props) =>
        props.inline &&
        css`
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 0;
            border: none;
            background: var(--primary-variant);
            box-shadow: var(--shadow-variant);
            grid-template-rows: 1fr;
            grid-template-columns: 1fr auto;
        `};

    h5 {
        padding: 0.5rem;
    }

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

const Buttons = styled.div<Props>`
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    border-top: 1px solid var(--primary-variant);
    display: flex;
    transition: 0.25s ease-out;

    ${(props) =>
        props.inline &&
        css`
            height: 100%;
            border-top: none;

            &::after {
                content: "";
                position: absolute;
                top: calc(50% - 1rem);
                left: 0;
                height: 2rem;
                border-left: 1px solid var(--primary-variant);
            }
        `};

    button {
        width: 100%;
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
    inline?: boolean;
    remove: boolean;
    unRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleDelete: (e: React.FormEvent) => void;
    children: React.ReactNode;
    className?: string;
};

const VehiculoForm = function ({
    inline,
    remove,
    unRemove,
    handleDelete,
    children,
    className,
}: ComponentProps) {
    return (
        <Container
            unmountOnExit
            timeout={{
                enter: 200,
                exit: 150,
            }}
            in={remove}
            className={className}
            inline={inline}
        >
            <h5>{children}</h5>
            <Buttons inline={inline}>
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
