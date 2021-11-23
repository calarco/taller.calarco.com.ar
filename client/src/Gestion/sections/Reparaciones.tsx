import React, { useState, useEffect } from "react";
import styled from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, TransitionGroup } from "react-transition-group";

import { useActive } from "Gestion/context/activeContext";
import useReparaciones from "Gestion/hooks/useReparaciones";
import SectionComponent from "components/Section";
import Create from "components/Create";
import ReparacionForm from "Gestion/forms/ReparacionForm";
import CardComponent from "Gestion/cards/ReparacionCard";

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
`;

const ReparacionCard = transition(CardComponent).attrs({
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
    const { activeCard, setActiveCard } = useActive();

    const [selected, setSelected] = useState(0);
    const { reparaciones } = useReparaciones({
        setSelected: setSelected,
    });
    const [create, setCreate] = useState(false);

    useEffect(() => {
        activeCard !== "Reparación" && setCreate(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Reparación") : setActiveCard("");
    }, [create, setActiveCard]);

    return (
        <Container
            in={
                !reparaciones.data[0] ||
                (reparaciones.data[0] && reparaciones.data[0].vehiculoId !== 0)
            }
        >
            <SwitchTransition>
                <Section
                    key={
                        !reparaciones.data[0] ||
                        (reparaciones.data[0] &&
                            reparaciones.data[0].vehiculoId)
                    }
                    overlay={activeCard !== "" ? true : false}
                >
                    <Create
                        type="Reparación"
                        isActive={
                            activeCard === "Reparación" && create ? true : false
                        }
                        onClick={() => setCreate(true)}
                    >
                        <ReparacionForm
                            isActive={
                                activeCard === "Reparación" && create
                                    ? true
                                    : false
                            }
                        />
                    </Create>
                    {reparaciones.data[0] ? (
                        <TransitionGroup component={null}>
                            {reparaciones.data[0].id !== 0 &&
                                reparaciones.data.map((aReparacion) => (
                                    <ReparacionCard
                                        key={aReparacion.id}
                                        reparacion={aReparacion}
                                        isActive={
                                            selected === aReparacion.id
                                                ? true
                                                : false
                                        }
                                        setActive={() => {
                                            selected === aReparacion.id
                                                ? setSelected(0)
                                                : setSelected(aReparacion.id);
                                        }}
                                    />
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
