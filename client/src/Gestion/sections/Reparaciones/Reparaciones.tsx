import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, TransitionGroup } from "react-transition-group";

import { useGestion } from "Gestion/gestionContext";
import useReparaciones from "Gestion/hooks/useReparaciones";
import SectionComponent from "components/Section";
import Create from "components/Create";
import CardComponent from "components/Card";
import Box from "./Box";
import ReparacionForm from "Gestion/forms/ReparacionForm";
import Remove from "components/Remove";

const Container = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
    position: absolute;
    z-index: 600;
    top: 3rem;
    right: 0;
    bottom: 0;
    left: 0;
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

type Props = {
    readonly edit?: boolean;
};

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

    ${(props: Props) =>
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

const Reparaciones = function () {
    const { vehiculoId, activeCard, setActiveCard } = useGestion();

    const [selected, setSelected] = useState(0);
    const { reparaciones } = useReparaciones({
        setSelected: setSelected,
    });
    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

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
        <Container in={reparaciones.data[0].vehiculoId !== 0}>
            <SwitchTransition>
                <Section
                    key={reparaciones.data[0].vehiculoId}
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
                        <ReparacionForm
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
                                            activeCard === "Reparación"
                                                ? true
                                                : false
                                        }
                                        onEdit={() =>
                                            setActiveCard("Reparación")
                                        }
                                        remove={remove}
                                        onRemove={() => {
                                            setRemove(true);
                                        }}
                                    >
                                        <Box
                                            reparacion={aReparacion}
                                            onClick={() => {
                                                selected === aReparacion.id
                                                    ? setSelected(0)
                                                    : setSelected(
                                                          aReparacion.id
                                                      );
                                            }}
                                        />
                                        {selected === aReparacion.id && (
                                            <>
                                                <ReparacionForm
                                                    reparacion={aReparacion}
                                                    edit={
                                                        activeCard ===
                                                            "Reparación" &&
                                                        !create
                                                            ? true
                                                            : false
                                                    }
                                                    unEdit={() => {
                                                        setActiveCard("");
                                                    }}
                                                />
                                                <Remove
                                                    id={aReparacion.id}
                                                    service="reparaciones"
                                                    remove={remove}
                                                    unRemove={() => {
                                                        setRemove(false);
                                                    }}
                                                />
                                            </>
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
