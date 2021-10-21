import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { TransitionGroup } from "react-transition-group";

import { useCarName } from "views/Gestion/carNameContext";
import CreateComponent from "components/Create";
import Form from "./Form";
import Remove from "components/Remove";

type Props = {
    active?: boolean;
    inactive?: boolean;
};

const Container = styled.div<Props>`
    position: relative;
    padding: 0.75rem 1.5rem;
    display: grid;
    align-items: start;
    grid-template-columns: 3rem 1fr;
    gap: 1.5rem;
    transition: 0.15s ease-in;

    ${(props) =>
        props.active &&
        css`
            position: sticky;
            top: 0;
            bottom: 10.75rem;
            z-index: 1500;
            transition: 0.2s ease-out;
        `};

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 0;
        border-bottom: var(--border-variant);

        ${(props) =>
            props.active &&
            css`
                transition: 0.2s ease-out;
                border-bottom: 1px solid rgba(0, 0, 0, 0);
            `};
    }
`;

const Dia = styled.div<Props>`
    position: relative;
    height: 3rem;
    padding: 0 0.5rem;
    text-transform: uppercase;
    text-align: center;
    display: grid;
    grid-template-rows: auto auto;

    h3 {
        font: 400 1.25rem/1.75rem var(--font-family-alt);
    }

    p {
        font: 400 0.9rem/1.25rem var(--font-family-alt);
    }

    ${(props) =>
        props.inactive &&
        css`
            & > * {
                color: var(--on-background-variant);
            }
        `};

    ${(props) =>
        props.active &&
        css`
            & > * {
                color: var(--secondary);
            }
        `};
`;

const List = styled.div<Props>`
    position: relative;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    transition: 0.15s ease-in;

    ${(props) =>
        props.active &&
        css`
            background: var(--surface-t);
            box-shadow: var(--shadow);
        `};
`;

const Create = styled(CreateComponent)`
    position: relative;
    backdrop-filter: none;
    background: none;
    border: none;
    box-shadow: none;
`;

const Turno = transition.div`
    position: relative;
    min-height: 3rem;
    display: grid;
    grid-template-columns: 1fr auto;

    h6 {
        padding: 0.5rem 1.5rem;
    }

    button {
        border: none;

        &:not(:first-child)::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: var(--border-variant);
        }
    }

    &:nth-child(2) {
        border-top: var(--border-variant);
    }

    &:enter {
        opacity: 0;
        max-height: 0;
    }

    &:enter-active {
        opacity: 1;
        max-height: 3rem;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
        max-height: 3rem;
    }

    &:exit-active {
        opacity: 0;
        max-height: 0;
        transition: 0.15s ease-in;
    }
`;

const Day = function ({ date, turnos, current, active, setActive, unActive }) {
    const { getCarName } = useCarName();
    const [remove, setRemove] = useState(0);

    const handleDelete = (id) => {
        feathersClient
            .service("turnos")
            .remove(id)
            .then(() => {})
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        setRemove(0);
    }, [turnos]);

    return (
        <Container active={active}>
            <Dia
                active={current}
                inactive={
                    [0, 6].indexOf(
                        new Date(date[0], date[1], date[2]).getDay()
                    ) !== -1
                }
                onClick={() => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }}
            >
                <h3>{date[2]}</h3>
                <p>
                    {new Date(date[0], date[1], date[2])
                        .toLocaleDateString("default", {
                            weekday: "short",
                        })
                        .substring(0, 3)}
                </p>
            </Dia>
            <List active={turnos[0] && turnos[0].id !== 0}>
                <Create
                    type="Turno"
                    active={active}
                    variant={!current}
                    onClick={setActive}
                >
                    <Form
                        turno={{
                            id: 0,
                            fecha: `${date[0]}-${(date[1] + 1)
                                .toString()
                                .padStart(2, "0")}-${date[2]
                                .toString()
                                .padStart(2, "0")}`,
                            motivo: "",
                            createdAt: "",
                            updatedAt: "",
                            modeloId: 0,
                        }}
                        edit={active}
                        unEdit={unActive}
                    />
                </Create>
                <TransitionGroup component={null}>
                    {turnos[0] &&
                        turnos[0].id !== 0 &&
                        turnos.map((aTurno) => (
                            <Turno
                                key={aTurno.id}
                                unmountOnExit
                                timeout={{
                                    enter: 200,
                                    exit: 150,
                                }}
                            >
                                <h6>
                                    {aTurno.motivo}
                                    <span>{getCarName(aTurno.modeloId)}</span>
                                </h6>
                                <button
                                    type="button"
                                    onClick={() => setRemove(aTurno.id)}
                                >
                                    Borrar
                                </button>
                                <Remove
                                    inline
                                    remove={remove === aTurno.id}
                                    unRemove={() => {
                                        setRemove(0);
                                    }}
                                    handleDelete={() => handleDelete(aTurno.id)}
                                >
                                    ¿Borrar turno?
                                </Remove>
                            </Turno>
                        ))}
                </TransitionGroup>
            </List>
        </Container>
    );
};

export default Day;
