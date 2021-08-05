import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly type?: string;
    readonly create?: boolean;
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly remove?: boolean;
    readonly state?: string;
};

const Container = styled.div<Props>`
    position: relative;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: 0.25s ease-in;

    &:hover {
        cursor: pointer;
        border: var(--border);
        transition: 0.2s ease-in;
    }

    ${(props) =>
        props.type === "Cliente" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            top: 0;
            overflow: visible;
            border-radius: 4px 4px 0 0;
            background: var(--surface);
            border: var(--border);
            box-shadow: var(--shadow);

            &:hover {
                cursor: default;
                border: var(--border);
                transition: 0.2s ease-in;
            }
        `};

    ${(props) =>
        props.create &&
        css`
            position: sticky;
            top: 0;
            z-index: 500;
            height: 3rem;
            padding: 0 0 3rem 0;
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(0.4rem);
            border: 1px solid var(--secondary);
            box-shadow: var(--shadow);

            &:hover {
                cursor: default;
                border: 1px solid var(--secondary);
            }
        `};

    ${(props) =>
        props.type !== "Cliente" &&
        props.active &&
        !props.create &&
        css`
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(0.4rem);
            border: 1px solid var(--primary);
            box-shadow: var(--shadow-variant);
            transition: 0.2s ease-in;

            &:hover {
                cursor: default;
                border: 1px solid var(--primary);
            }
        `};

    ${(props) =>
        props.type !== "Cliente" &&
        props.active &&
        !props.create &&
        css`
            position: sticky;
            top: 4.5rem;
            bottom: 0;
            z-index: 1000;
        `};

    ${(props) =>
        props.type !== "Cliente" &&
        !props.create &&
        props.edit &&
        css`
            z-index: 1500;
        `};

    ${(props) =>
        props.edit &&
        css`
            box-shadow: none;
        `};

    ${(props) =>
        props.type !== "Cliente" &&
        props.edit &&
        css`
            position: sticky;
            top: 0;
            bottom: 6rem;
            z-index: 1500;
        `};

    ${(props) =>
        props.type === "Vehículo" &&
        props.edit &&
        css`
            bottom: 16rem;
        `};

    ${(props) =>
        props.remove &&
        css`
            background: rgba(255, 255, 255, 1);
            border: 1px solid var(--error-variant);
            transition: 0.3s ease-in;

            &:hover {
                cursor: default;
                border: 1px solid var(--error-variant);
            }
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

        ${(props) =>
            props.type === "Cliente" &&
            css`
                border-top: none;
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
    display: flex;
    transition: 0.25s ease-out;

    ${(props) =>
        !props.create &&
        css`
            border-top: var(--border);
        `};

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

const Card = function ({
    type,
    create,
    active,
    edit,
    state,
    children,
    onEdit,
    onRemove,
}) {
    return (
        <Container
            type={type}
            create={create}
            active={active}
            edit={edit}
            state={state}
        >
            {children}
            {(active || create) && (
                <Buttons create={create} edit={edit}>
                    {create ? (
                        <>
                            <button type="button" onClick={onEdit}>
                                Crear {type}
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={onRemove}>
                                Borrar
                            </button>
                            <button type="button" onClick={onEdit}>
                                Editar
                            </button>
                        </>
                    )}
                </Buttons>
            )}
        </Container>
    );
};

export default Card;
