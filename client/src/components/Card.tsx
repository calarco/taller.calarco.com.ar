import React, { useState, useEffect } from "react";
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

    ${(props) =>
        props.type === "Cliente" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            top: 0;
            overflow: visible;
        `};

    ${(props) =>
        props.create &&
        css`
            position: sticky;
            top: 0;
            z-index: 1000;
            height: 3rem;
            padding: 0 0 3rem 0;
        `};

    ${(props) =>
        props.type !== "Cliente" &&
        !props.create &&
        props.active &&
        css`
            position: sticky;
            top: 4.5rem;
            bottom: 0;
            z-index: 1000;
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

const Box = styled.div<Props>`
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
        props.edit &&
        css`
            box-shadow: none;
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

    > article {
        width: 100%;
        overflow: hidden;
        display: grid;
        align-items: center;

        ${(props) =>
            props.create &&
            css`
                visibility: hidden;
                opacity: 0;
            `};

        ${(props) =>
            props.edit &&
            css`
                visibility: hidden;
                opacity: 0;
            `};
    }

    form {
        content-visibility: auto;
        will-change: opacity;
        visibility: hidden;
        opacity: 0;
        position: absolute;
        z-index: 1500;
        top: -1px;
        left: -1px;
        right: -1px;
        transform: translateY(-0.75rem);
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid var(--primary);
        box-shadow: var(--shadow);
        background: var(--primary);
        display: grid;
        gap: 1px;
        align-items: start;
        transition: 0.25s ease-in;

        ${(props) =>
            props.edit &&
            css`
                visibility: visible;
                opacity: 1;
                transform: initial;
                transition: 0.3s ease-in;
            `};

        label {
            height: 100%;
            padding: 0.5rem 1rem;
            background: var(--surface);
        }
    }
`;

const Remove = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 3rem;
    left: 1px;
    padding: 1.25rem 2.25rem;
    border-radius: 4px 4px 0 0;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(0.5rem);
    display: grid;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
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
    grid-row: 2;
    grid-column: 1;
    position: relative;
    width: 100%;
    height: 3rem;
    max-height: 0;
    overflow: hidden;
    border-radius: 4px;
    border-top: 1px solid rgba(0, 0, 0, 0);
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

        ${(props) =>
            props.create &&
            css`
                color: var(--primary);

                &:hover {
                    color: var(--secondary);
                    background: var(--secondary-variant);
                }
            `};
    }

    ${(props) =>
        (props.create || props.active) &&
        css`
            visibility: visible;
            max-height: 3rem;
            transition: 0.2s ease-in;
        `};

    ${(props) =>
        props.active &&
        !props.create &&
        css`
            border-top: var(--border);
        `};
`;

const Card = function ({
    type,
    create,
    active,
    activeCard,
    setActiveCard,
    state,
    children,
}) {
    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        activeCard !== type && setEdit(false);
    }, [type, activeCard]);

    useEffect(() => {
        create && active && setEdit(true);
        !active && setRemove(false);
    }, [create, active]);

    useEffect(() => {
        edit ? setActiveCard(type) : setActiveCard("");
    }, [type, edit, setActiveCard]);

    return (
        <Container
            type={type}
            create={create}
            active={active}
            edit={edit}
            remove={remove}
            state={state}
        >
            <Box
                type={type}
                create={create}
                active={active}
                edit={edit}
                remove={remove}
            >
                {children}
                {!create && (
                    <Remove active={remove}>
                        <h5>¿Borrar {type}?</h5>
                    </Remove>
                )}
                <Buttons create={create} active={active} edit={edit}>
                    {create ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setEdit(true);
                                }}
                            >
                                Crear {type}
                            </button>
                        </>
                    ) : create && edit && active ? (
                        <>
                            <button type="submit" onClick={() => {}}>
                                Crear {type}
                            </button>
                        </>
                    ) : remove ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setRemove(false);
                                }}
                            >
                                Cancelar
                            </button>
                            <button type="reset" onClick={() => {}}>
                                Borrar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setRemove(true);
                                }}
                            >
                                Borrar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEdit(true);
                                }}
                            >
                                Editar
                            </button>
                        </>
                    )}
                </Buttons>
            </Box>
        </Container>
    );
};

export default Card;
