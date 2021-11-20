import React, { MouseEvent, ReactNode } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";

type Props = {
    readonly isActive?: boolean;
    readonly isForm?: boolean;
    readonly isRemove?: boolean;
};

const Container = styled.div<Props>`
    position: relative;
    border-radius: 4px;
    transition: 0.2s ease-in;

    ${(props) =>
        !props.isActive &&
        !props.isForm &&
        css`
            &:hover {
                cursor: pointer;
                background: var(--primary-variant);
                transition: 0.2s ease-in;
            }
        `};

    ${(props) =>
        props.isActive &&
        css`
            position: sticky;
            top: 4.5rem;
            bottom: 0;
            z-index: 1000;
            background: var(--primary-variant);
            backdrop-filter: blur(0.4rem);
            outline: 1px solid var(--primary);
            box-shadow: var(--shadow-variant);
            transition: 0.2s ease-in;

            &:hover {
                cursor: default;
            }
        `};

    ${(props) =>
        props.isForm &&
        css`
            position: sticky;
            top: 0;
            z-index: 1500;
            backdrop-filter: none;
            box-shadow: var(--shadow-variant);
        `};

    ${(props) =>
        props.isRemove &&
        css`
            backdrop-filter: none;
        `};

    &:not(:first-child)::after {
        content: "";
        position: absolute;
        top: -0.75rem;
        z-index: 0;
        width: 100%;
        border-top: var(--border-variant);

        ${(props) =>
            props.isForm &&
            css`
                border-top: 1px solid rgba(0, 0, 0, 0);
                transition: 0.3s ease-out;
            `};
    }
`;

const Buttons = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    grid-row: 5;
    grid-column-start: 1;
    grid-column-end: span 3;
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    border-top: 1px solid var(--primary-variant);
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

    &:enter {
        max-height: 0;
    }

    &:enter-active {
        max-height: 3rem;
        transition: 0.2s ease-out;
    }

    &:exit {
        max-height: 3rem;
    }

    &:exit-active {
        max-height: 0;
        transition: 0.15s ease-in;
    }
`;

type ComponentProps = {
    isActive: boolean;
    isRemove: boolean;
    setRemove: (e: MouseEvent<HTMLButtonElement>) => void;
    isForm: boolean;
    setForm: (e: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    className?: string;
};

const Card = function ({
    isActive,
    isRemove,
    setRemove,
    isForm,
    setForm,
    children,
    className,
}: ComponentProps) {
    return (
        <Container
            isActive={isActive}
            isForm={isForm}
            isRemove={isRemove}
            className={className}
        >
            {children}
            <Buttons in={isActive}>
                <button type="button" onClick={setRemove}>
                    Borrar
                </button>
                <button type="button" onClick={setForm}>
                    Editar
                </button>
            </Buttons>
        </Container>
    );
};

export default Card;
