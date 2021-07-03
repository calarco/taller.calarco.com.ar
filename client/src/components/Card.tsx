import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

type Props = {
    readonly type?: string;
    readonly create?: boolean;
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly remove?: boolean;
    readonly state?: string;
    readonly message?: boolean;
};

const Container = styled.div<Props>`
    position: relative;
    transition: 0.25s ease-in;

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
                border-top: 1px solid rgba(0, 0, 0, 0);
            `};
    }

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
        props.active &&
        !props.create &&
        css`
            position: sticky;
            top: 4.5rem;
            bottom: 0;
            z-index: 1000;
            padding: 0 0 3rem 0;
            transition: 0.3s ease-in;
        `};

    ${(props) =>
        props.edit &&
        css`
            position: sticky;
            top: 0;
            bottom: 6rem;
            z-index: 1500;
        `};

    ${(props) =>
        props.type === "Cliente" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            top: 0;
            border-radius: 4px;
            box-shadow: var(--shadow-variant);
            overflow: visible;
            background: var(--surface);
        `};

    ${(props) =>
        props.type === "Vehículo" &&
        props.edit &&
        css`
            bottom: 16rem;
        `};

    > article {
        opacity: 0;
        max-height: 25rem;
        width: 100%;
        overflow: hidden;
        display: grid;
        align-items: center;
    }

    > aside,
    > div {
        display: none;
    }
`;

const Form = styled.form<Props>`
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    left: 0;
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
            &:hover {
                cursor: default;
                border: 1px solid rgba(0, 0, 0, 0);
                transition: 0.2s ease-in;
            }
        `};

    ${(props) =>
        props.create &&
        props.type === "Cliente" &&
        css`
            border: 1px solid var(--secondary);

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
        props.type !== "Cliente" &&
        props.create &&
        css`
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(0.4rem);
            border: 1px solid var(--secondary);
            box-shadow: var(--shadow);
            transition: 0.3s ease-out;

            &:hover {
                cursor: default;
                border: 1px solid var(--secondary);
            }
        `};

    ${(props) =>
        props.edit &&
        css`
            z-index: 1500;
            background: var(--surface);
            backdrop-filter: none;
            border: 1px solid var(--primary);
            box-shadow: var(--shadow);
            transition: 0.3s ease-out;

            &:hover {
                cursor: default;
                border: 1px solid var(--primary);
            }
        `};

    ${(props) =>
        props.remove &&
        css`
            background: var(--surface);
            backdrop-filter: none;
            border: 1px solid var(--error-variant);
            box-shadow: var(--shadow);
            transition: 0.3s ease-out;

            &:hover {
                cursor: default;
                border: 1px solid var(--error-variant);
            }
        `};

    ${(props) =>
        props.message &&
        css`
            background: var(--surface);
            backdrop-filter: none;
            transition: 0.3s ease-out;

            &:hover {
                cursor: default;
            }
        `};
`;

const Box = styled.div<Props>`
    display: grid;
    align-items: start;

    > article {
        grid-row: 1;
        grid-column: 1;
        max-height: 25rem;
        width: 100%;
        overflow: hidden;
        border-radius: 4px 4px 0 0;
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

    > aside {
        visibility: hidden;
        opacity: 0;
        grid-row: 1;
        grid-column: 1;
        max-height: 0;
        width: 100%;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
        background: var(--primary);
        display: grid;
        gap: 1px;
        align-items: start;
        transition: 0.25s ease-in;

        label {
            height: 100%;
            padding: 0.5rem 1rem;
            background: var(--surface);
        }

        ${(props) =>
            props.edit &&
            css`
                min-height: 100%;
                visibility: visible;
                opacity: 1;
                max-height: 17.25rem;
                max-height: 25rem;
                transform: initial;
                transition: 0.3s ease-out;
            `};
    }

    > div {
        visibility: hidden;
        opacity: 0;
        grid-row: 1;
        grid-column: 1;
        width: 100%;
        height: 100%;
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
            props.remove &&
            css`
                visibility: visible;
                opacity: 1;
                transition: 0.3s ease-in;
            `};
    }
`;

const Buttons = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
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
    transition: 25s ease-out;

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
            !props.edit &&
            css`
                color: var(--primary);

                &:hover {
                    color: var(--secondary);
                    background: var(--secondary-variant);
                }
            `};
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            visibility: visible;
            opacity: 1;
            transform: initial;
            transition: 0.3s ease-in;
        `};

    > div {
        position: absolute;
        visibility: hidden;
        opacity: 0;
        width: 100%;
        height: 100%;
        padding: 0 2.25rem;
        border-radius: 4px 4px 0 0;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(0.5rem);
        display: grid;
        gap: 0.5rem;
        align-items: center;
        text-align: center;
        transition: 0.25s ease-out;

        ${(props) =>
            props.message &&
            css`
                visibility: visible;
                opacity: 1;
                transition: 0.3s ease-in;
            `};
    }

    ${(props) =>
        (props.create || props.active || props.edit) &&
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

    ${(props) =>
        (props.edit || props.message) &&
        css`
            border-top: 1px solid var(--primary);
        `};
`;

const Card = function ({
    type,
    message,
    create,
    active,
    activeSection,
    setActiveSection,
    onSubmit,
    onReset,
    children,
}) {
    const nodeRef = React.useRef(null);
    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        create && active ? setEdit(true) : setEdit(false);
        !active && setRemove(false);
    }, [create, active, setEdit]);

    useEffect(() => {
        activeSection !== type && setEdit(false);
    }, [type, activeSection]);

    useEffect(() => {
        edit ? setActiveSection(type) : setActiveSection("");
    }, [type, edit, setActiveSection]);

    return (
        <>
            <Container type={type} create={create} active={active} edit={edit}>
                {children}
                <Form
                    onSubmit={onSubmit}
                    onReset={onReset}
                    noValidate
                    type={type}
                    create={create}
                    active={active}
                    edit={edit}
                    remove={remove}
                    message={message === "" ? false : true}
                >
                    <Box
                        create={create}
                        active={active}
                        edit={edit}
                        remove={remove}
                    >
                        {children}
                        {!create && (
                            <div>
                                <h5>¿Borrar {type}?</h5>
                            </div>
                        )}
                    </Box>
                    <SwitchTransition>
                        <Transition
                            nodeRef={nodeRef}
                            key={edit || remove ? "0" : "1"}
                            addEndListener={(nodeRef, done) => {
                                nodeRef.addEventListener(
                                    "transitionend",
                                    done,
                                    false
                                );
                            }}
                            unmountOnExit
                            mountOnEnter
                        >
                            {(state) => (
                                <Buttons
                                    create={create}
                                    active={active}
                                    edit={edit}
                                    state={state}
                                    message={message === "" ? false : true}
                                >
                                    {create && !edit ? (
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
                                            <button
                                                type="submit"
                                                onClick={() => {}}
                                            >
                                                Crear {type}
                                            </button>
                                        </>
                                    ) : create && edit ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEdit(false);
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                onClick={() => {}}
                                            >
                                                Crear {type}
                                            </button>
                                        </>
                                    ) : edit ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEdit(false);
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                onClick={() => {}}
                                            >
                                                Guardar
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
                                            <button
                                                type="reset"
                                                onClick={() => {}}
                                            >
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
                                    <div>
                                        <h5>{message}</h5>
                                    </div>
                                </Buttons>
                            )}
                        </Transition>
                    </SwitchTransition>
                </Form>
            </Container>
        </>
    );
};

export default Card;
