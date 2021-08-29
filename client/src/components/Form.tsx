import React from "react";
import styled from "styled-components";
import transition from "styled-transition-group";

const Container = transition.form.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    will-change: opacity;
    content-visibility: auto;
    position: absolute;
    z-index: 1500;
    top: -1px;
    left: -1px;
    right: -1px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--primary);
    background: var(--primary);
    box-shadow: var(--shadow);
    display: grid;
    gap: 1px;
    align-items: start;

    label {
        height: 100%;
        padding: 0.5rem 1rem;
        background: var(--surface);
    }

    &:enter {
        opacity: 0;
        transform: translateY(-1rem);
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
        transform: translateY(-1rem);
        transition: 0.15s ease-in;
    }
`;

const Buttons = styled.div`
    grid-column-start: 1;
    grid-column-end: span end;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    background: var(--surface);
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

type ComponentProps = {
    edit: boolean;
    unEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
    className?: string;
};

const Form = function ({
    edit,
    unEdit,
    onSubmit,
    children,
    className,
}: ComponentProps) {
    return (
        <Container in={edit} onSubmit={onSubmit} className={className}>
            {children}
            <Buttons>
                <button type="button" onClick={unEdit}>
                    Cancelar
                </button>
                <button type="submit" onClick={() => {}}>
                    Guardar
                </button>
            </Buttons>
        </Container>
    );
};

export default Form;
