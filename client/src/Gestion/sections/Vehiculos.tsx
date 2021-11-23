import React, { useState, useEffect } from "react";
import styled from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, TransitionGroup } from "react-transition-group";

import { useActive } from "Gestion/context/activeContext";
import useVehiculos from "Gestion/hooks/useVehiculos";
import SectionComponent from "components/Section";
import Create from "components/Create";
import VehiculoForm from "Gestion/forms/VehiculoForm";
import CardComponent from "Gestion/cards/VehiculoCard";

const Container = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
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

const VehiculoCard = transition(CardComponent).attrs({
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

const Vehiculos = function () {
    const { clienteId, activeCard, setActiveCard } = useActive();
    const { vehiculos } = useVehiculos();

    const [create, setCreate] = useState(false);

    useEffect(() => {
        create ? setActiveCard("Vehículo") : setActiveCard("");
    }, [create, setActiveCard]);

    useEffect(() => {
        activeCard !== "Vehículo" && setCreate(false);
    }, [activeCard]);

    return (
        <Container
            in={
                !vehiculos.data[0] ||
                (vehiculos.data[0] && vehiculos.data[0].clienteId !== 0)
            }
        >
            <SwitchTransition>
                <Section
                    key={
                        !vehiculos.data[0] ||
                        (vehiculos.data[0] && vehiculos.data[0].clienteId)
                    }
                    overlay={
                        activeCard === "Vehículo" || activeCard === "Cliente"
                            ? true
                            : false
                    }
                >
                    <Create
                        type="Vehículo"
                        isActive={
                            activeCard === "Vehículo" && create ? true : false
                        }
                        onClick={() => {
                            setCreate(true);
                        }}
                    >
                        <VehiculoForm
                            vehiculo={{
                                id: 0,
                                patente: "",
                                year: "",
                                combustible: "Nafta",
                                cilindrada: "",
                                vin: "",
                                createdAt: "",
                                updatedAt: "",
                                clienteId: clienteId,
                                modeloId: 0,
                            }}
                            isActive={
                                activeCard === "Vehículo" && create
                                    ? true
                                    : false
                            }
                        />
                    </Create>
                    <TransitionGroup component={null}>
                        {vehiculos.data[0] && vehiculos.data[0].id !== 0 ? (
                            vehiculos.data.map((aVehiculo) => (
                                <VehiculoCard
                                    key={aVehiculo.id}
                                    vehiculo={aVehiculo}
                                />
                            ))
                        ) : (
                            <Empty>No se encontraron vehiculos</Empty>
                        )}
                    </TransitionGroup>
                </Section>
            </SwitchTransition>
        </Container>
    );
};

export default Vehiculos;
