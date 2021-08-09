import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly state?: string;
};

const Container = styled.div<Props>`
    position: relative;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: 0.25s ease-in;

    ${(props) =>
        !props.active &&
        !props.edit &&
        css`
            &:hover {
                cursor: pointer;
                border: var(--border);
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
            background: rgba(255, 255, 255, 0.75);
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
            bottom: 6rem;
            z-index: 1500;
            backdrop-filter: none;
            border: 1px solid rgba(0, 0, 0, 0);
            box-shadow: var(--shadow-variant);
        `};

    ${(props) =>
        props.state === "entering" || props.state === "exiting"
            ? css`
                  will-change: opacity;
                  visibility: hidden;
                  opacity: 0;
                  transition: 0.25s ease-in;
              `
            : css`
                  will-change: auto;
                  visibility: visible;
                  opacity: 1;
                  transform: initial;
                  transition: 0.3s ease-out;
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

const Buttons = styled.div<Props>`
    grid-row: 5;
    grid-column-start: 1;
    grid-column-end: span 3;
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
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

type ComponentProps = {
    active: boolean;
    edit: boolean;
    onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
    state?: string;
    children: React.ReactNode;
    className?: string;
};

const Card = function ({
    active,
    edit,
    onEdit,
    onRemove,
    state,
    children,
    className,
}: ComponentProps) {
    return (
        <Container
            active={active}
            edit={edit}
            state={state}
            className={className}
        >
            {children}
            {active && (
                <Buttons>
                    <button type="button" onClick={onRemove}>
                        Borrar
                    </button>
                    <button type="button" onClick={onEdit}>
                        Editar
                    </button>
                </Buttons>
            )}
        </Container>
    );
};

export default Card;
