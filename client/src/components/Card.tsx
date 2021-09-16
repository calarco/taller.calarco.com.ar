import React from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";

type Props = {
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly remove?: boolean;
};

const Container = styled.div<Props>`
    position: relative;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: 0.2s ease-in;

    ${(props) =>
        !props.active &&
        !props.edit &&
        css`
            &:hover {
                cursor: pointer;
                background: var(--primary-variant);
                transition: 0.2s ease-in;
            }
        `};

    ${(props) =>
        props.active &&
        css`
            position: sticky;
            top: 4.5rem;
            bottom: 0;
            z-index: 1000;
            background: var(--primary-variant);
            backdrop-filter: blur(0.4rem);
            border: 1px solid var(--primary);
            box-shadow: var(--shadow-variant);
            transition: 0.2s ease-in;

            &:hover {
                cursor: default;
            }
        `};

    ${(props) =>
        props.edit &&
        css`
            position: sticky;
            top: 0;
            z-index: 1500;
            backdrop-filter: none;
            border: 1px solid rgba(0, 0, 0, 0);
            box-shadow: var(--shadow-variant);
        `};

    ${(props) =>
        props.remove &&
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
            props.edit &&
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
    border-top: var(--border-primary);
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
            border-left: var(--border-primary);
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
    active: boolean;
    edit: boolean;
    onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    remove: boolean;
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    className?: string;
};

const Card = function ({
    active,
    edit,
    onEdit,
    remove,
    onRemove,
    children,
    className,
}: ComponentProps) {
    return (
        <Container
            active={active}
            edit={edit}
            remove={remove}
            className={className}
        >
            {children}
            <Buttons in={active}>
                <button type="button" onClick={onRemove}>
                    Borrar
                </button>
                <button type="button" onClick={onEdit}>
                    Editar
                </button>
            </Buttons>
        </Container>
    );
};

export default Card;
