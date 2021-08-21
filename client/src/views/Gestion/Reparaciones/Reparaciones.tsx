import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, TransitionGroup } from "react-transition-group";

import SectionComponent from "components/Section";
import Create from "components/Create";
import CardComponent from "components/Card";
import Box from "./Box";
import Actions from "./Actions";

const Container = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
    position: relative;
    grid-column-end: 1;
    grid-row-start: 2;
    grid-row-end: 2;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
    background: var(--surface);
    border-top: var(--border-variant);
    box-shadow: var(--shadow);

    &:enter {
        opacity: 0;
        transform: translateY(-1rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.3s ease-out;
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

const Section = transition(SectionComponent).attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    &:enter {
        opacity: 0;
    }

    &:enter-active {
        opacity: 1;
        transition: 0.3s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transition: 0.15s ease-in;
    }

    ${(props) =>
        props.edit &&
        css`
            bottom: 6rem;
        `};
`;

const Card = transition(CardComponent).attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    &:enter {
        opacity: 0;
    }

    &:enter-active {
        opacity: 1;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transition: 0.15s ease-in;
    }
`;

const Empty = styled.h5`
    padding: 2rem;
    text-align: center;
    color: var(--on-background-variant);
`;

const Reparaciones = function ({ vehiculoId, activeCard, setActiveCard }) {
    const [count, setCount] = useState(0);
    const [selected, setSelected] = useState(0);
    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

    const [reparaciones, setReparaciones] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                vehiculoId: "",
                reparacion: "",
                repuestos: "",
                labor: "",
                costo: "",
                km: "0",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });

    const loadReparaciones = useCallback(
        (setId?: boolean) => {
            feathersClient
                .service("reparaciones")
                .find({
                    query: {
                        vehiculoId: vehiculoId,
                        $limit: 100,
                        $sort: {
                            createdAt: -1,
                        },
                    },
                })
                .then((found) => {
                    setCount((count) => count + 1);
                    setReparaciones(found);
                    setActiveCard("");
                    setId && setSelected(found.data[0].id);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        },
        [vehiculoId, setActiveCard]
    );

    useEffect(() => {
        feathersClient
            .service("reparaciones")
            .on("created", () => loadReparaciones(true));
        feathersClient
            .service("reparaciones")
            .on("patched", () => loadReparaciones());
        feathersClient.service("reparaciones").on("removed", () => {
            loadReparaciones();
            setSelected(0);
        });
    }, [loadReparaciones]);

    useEffect(() => {
        vehiculoId !== 0
            ? loadReparaciones()
            : setReparaciones({
                  total: 0,
                  limit: 0,
                  skip: 0,
                  data: [
                      {
                          id: 0,
                          vehiculoId: "",
                          reparacion: "",
                          repuestos: "",
                          labor: "",
                          costo: "",
                          km: "0",
                          createdAt: "",
                          updatedAt: "",
                      },
                  ],
              });
        setSelected(0);
    }, [vehiculoId, loadReparaciones]);

    useEffect(() => {
        setRemove(false);
    }, [selected]);

    useEffect(() => {
        activeCard !== "Reparación" && setCreate(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Reparación") : setActiveCard("");
    }, [create, setActiveCard]);

    return (
        <Container in={!reparaciones.data[0] || reparaciones.data[0].id !== 0}>
            <SwitchTransition>
                <Section
                    key={count}
                    overlay={activeCard !== "" ? true : false}
                    onClick={() => {
                        setActiveCard("");
                    }}
                >
                    <Create
                        type="Reparación"
                        active={
                            activeCard === "Reparación" && create ? true : false
                        }
                        onClick={() => setCreate(true)}
                    >
                        <Actions
                            reparacion={{
                                id: 0,
                                vehiculoId: vehiculoId,
                                reparacion: "",
                                repuestos: "",
                                labor: "0",
                                costo: "0",
                                km: reparaciones.data[0]
                                    ? reparaciones.data[0].km
                                    : "0",
                                createdAt: new Date().toISOString(),
                                updatedAt: "",
                            }}
                            edit={
                                activeCard === "Reparación" && create
                                    ? true
                                    : false
                            }
                            unEdit={() => {
                                setActiveCard("");
                            }}
                            remove={remove}
                            unRemove={() => {
                                setRemove(false);
                            }}
                        />
                    </Create>
                    {reparaciones.data[0] ? (
                        <TransitionGroup component={null}>
                            {reparaciones.data[0].id !== 0 &&
                                reparaciones.data.map((aReparacion) => (
                                    <Card
                                        key={aReparacion.id}
                                        active={
                                            selected === aReparacion.id
                                                ? true
                                                : false
                                        }
                                        edit={
                                            !create &&
                                            selected === aReparacion.id &&
                                            (activeCard === "Reparación" ||
                                                remove)
                                                ? true
                                                : false
                                        }
                                        onEdit={() =>
                                            setActiveCard("Reparación")
                                        }
                                        onRemove={() => {
                                            setRemove(true);
                                        }}
                                    >
                                        <Box
                                            reparacion={aReparacion}
                                            onClick={() => {
                                                setSelected(aReparacion.id);
                                            }}
                                        />
                                        {selected === aReparacion.id && (
                                            <Actions
                                                reparacion={aReparacion}
                                                edit={
                                                    activeCard ===
                                                        "Reparación" && !create
                                                        ? true
                                                        : false
                                                }
                                                unEdit={() => {
                                                    setActiveCard("");
                                                }}
                                                remove={remove}
                                                unRemove={() => {
                                                    setRemove(false);
                                                }}
                                            />
                                        )}
                                    </Card>
                                ))}
                        </TransitionGroup>
                    ) : (
                        <Empty>No se encontraron reparaciones</Empty>
                    )}
                </Section>
            </SwitchTransition>
        </Container>
    );
};

export default Reparaciones;
