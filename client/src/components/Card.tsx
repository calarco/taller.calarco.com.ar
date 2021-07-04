import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

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

    ${(props) =>
        props.type === "Cliente" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            top: 0;
            box-shadow: var(--shadow-variant);
            overflow: visible;
            background: var(--surface);

            &:hover {
                cursor: default;
                transition: 0.2s ease-in;
            }
        `};

    ${(props) =>
        props.create &&
        css`
            position: sticky;
            top: 0;
            z-index: 1000;
            height: 3rem;
            padding: 0 0 3rem 0;
            transition: 0.3s ease-out;
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
            transition: 0.3s ease-in;
        `};

    ${(props) =>
        props.type !== "Cliente" &&
        props.edit &&
        css`
            position: sticky;
            top: 0;
            bottom: 6rem;
            z-index: 1500;
            backdrop-filter: none;
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

    &:hover {
        cursor: pointer;
        border: var(--border);
        transition: 0.2s ease-in;
    }

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
        props.remove &&
        css`
            backdrop-filter: none;
            border: 1px solid var(--error-variant);
            transition: 0.2s ease-in;

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
`;

const Cliente = styled.article`
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto;

    div {
        display: grid;
        gap: 0.5rem;
    }

    div:last-child {
        text-align: right;
    }
`;

const Vehiculo = styled.article`
    padding: 1rem 1.5rem;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 4.25rem 1fr;
    gap: 1rem;

    h4 {
        text-align: right;
    }

    div {
        display: grid;
        gap: 0.5rem;
    }
`;

const Reparación = styled.article`
    padding: 1.5rem 2rem;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
`;

const Numbers = styled.div`
    text-align: right;
`;

const Remove = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 3rem;
    left: 1px;
    grid-row: 1;
    grid-column: 1;
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

const Form = styled.form<Props>`
    position: absolute;
    z-index: 0;
    top: 0;
    right: 0;
    left: 0;
    border-radius: 4px;

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
        props.message &&
        css`
            background: var(--surface);
            backdrop-filter: none;
            transition: 0.3s ease-out;

            &:hover {
                cursor: default;
            }
        `};

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
    transition: 0.25s ease-out;

    visibility: visible;
    opacity: 1;

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
    activeCard,
    setActiveCard,
    onSubmit,
    onReset,
    children,
    data,
    matchModelo,
    onClick,
}) {
    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        create && active ? setEdit(true) : setEdit(false);
        !active && setRemove(false);
    }, [create, active, setEdit]);

    useEffect(() => {
        activeCard !== type && setEdit(false);
    }, [type, activeCard]);

    useEffect(() => {
        edit ? setActiveCard(type) : setActiveCard("");
    }, [type, edit, setActiveCard]);

    return (
        <>
            <Container
                type={type}
                create={create}
                active={active}
                edit={edit}
                remove={remove}
            >
                <Box
                    type={type}
                    create={create}
                    active={active}
                    remove={remove}
                >
                    {data.id !== 0 && type === "Cliente" ? (
                        <Cliente>
                            <div>
                                <h2>
                                    {data.nombre} {data.apellido}
                                </h2>
                                {data.empresa && <h5> {data.empresa}</h5>}
                            </div>
                            <div>
                                {data.dni && (
                                    <label>
                                        DNI / CUIT / CUIL N°
                                        <span>{data.dni}</span>
                                    </label>
                                )}
                                {data.telefono && (
                                    <label>
                                        Telefono
                                        <span>{data.telefono}</span>
                                    </label>
                                )}
                                {data.email && (
                                    <label>
                                        Email
                                        <span>{data.email} </span>
                                    </label>
                                )}
                            </div>
                        </Cliente>
                    ) : data.id !== 0 && type === "Vehículo" ? (
                        <Vehiculo onClick={onClick}>
                            <h4>{data.patente}</h4>
                            <div>
                                <h6>{matchModelo(data.modeloId)}</h6>
                                <p>
                                    {data.combustible} {data.cilindrada}
                                    <small>{data.year}</small>
                                </p>
                            </div>
                            <p>{data.vin}</p>
                        </Vehiculo>
                    ) : data.id !== 0 && type === "Reparación" ? (
                        <Reparación onClick={onClick}>
                            <h5>
                                {data.createdAt &&
                                    Intl.DateTimeFormat("default", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }).format(new Date(data.createdAt))}
                                <small>{data.km} km</small>
                            </h5>
                            <Numbers>Total</Numbers>
                            <h4>
                                $
                                {parseInt(data.costo, 10) +
                                    parseInt(data.labor, 10)}
                            </h4>
                            <div>
                                <h4>{data.reparacion}</h4>
                            </div>
                            <Numbers>
                                <h6>${data.labor}</h6>
                            </Numbers>
                            <label>Mano de obra</label>
                            <p>{data.repuestos}</p>
                            <Numbers>
                                <h6>${data.costo}</h6>
                            </Numbers>
                            <label>Repuestos</label>
                        </Reparación>
                    ) : undefined}
                    {!create && (
                        <Remove active={remove}>
                            <h5>¿Borrar {type}?</h5>
                        </Remove>
                    )}
                    <Buttons
                        create={create}
                        active={active}
                        edit={edit}
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
                        <div>
                            <h5>{message}</h5>
                        </div>
                    </Buttons>
                </Box>
                {edit && (
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
                        {children}
                        <Buttons
                            create={create}
                            active={active}
                            edit={edit}
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
                                    <button type="submit" onClick={() => {}}>
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
                                    <button type="submit" onClick={() => {}}>
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
                                    <button type="submit" onClick={() => {}}>
                                        Guardar
                                    </button>
                                </>
                            ) : undefined}
                            <div>
                                <h5>{message}</h5>
                            </div>
                        </Buttons>
                    </Form>
                )}
            </Container>
        </>
    );
};

export default Card;
