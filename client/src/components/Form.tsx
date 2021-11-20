import React, { MouseEvent, FormEvent, ReactNode } from "react";
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
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    border-radius: 4px;
    outline: 1px solid var(--primary);
    background: var(--primary);
    box-shadow: var(--shadow);
    display: grid;
    gap: 1px;
    align-items: start;

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
    isActive: boolean;
    exit: (e: MouseEvent<HTMLButtonElement>) => void;
    onSubmit: (e: FormEvent) => void;
    children: ReactNode;
    className?: string;
    noButtons?: boolean;
};

const Form = function ({
    isActive,
    exit,
    onSubmit,
    children,
    className,
    noButtons,
}: ComponentProps) {
    return (
        <Container in={isActive} onSubmit={onSubmit} className={className}>
            {children}
            {!noButtons && (
                <Buttons>
                    <button type="button" onClick={exit}>
                        Cancelar
                    </button>
                    <button type="submit" onClick={() => {}}>
                        Guardar
                    </button>
                </Buttons>
            )}
        </Container>
    );
};

export default Form;
