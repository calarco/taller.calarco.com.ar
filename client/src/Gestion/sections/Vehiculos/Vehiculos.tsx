import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, TransitionGroup } from "react-transition-group";

import { useGestion } from "Gestion/gestionContext";
import useVehiculos from "Gestion/hooks/useVehiculos";
import SectionComponent from "components/Section";
import Create from "components/Create";
import CardComponent from "components/Card";
import Box from "./Box";
import VehiculoForm from "Gestion/forms/VehiculoForm";
import Remove from "components/Remove";

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

type Props = {
    edit?: boolean;
};

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

    ${(props: Props) =>
        props.edit &&
        css`
            bottom: 15rem;
        `};
`;

const Empty = styled.h5`
    padding: 2rem;
    text-align: center;
    color: var(--on-background-variant);
`;

const Vehiculos = function () {
    const { clienteId, vehiculoId, setVehiculoId, activeCard, setActiveCard } =
        useGestion();
    const { vehiculos } = useVehiculos();

    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        setRemove(false);
    }, [vehiculoId]);

    useEffect(() => {
        create ? setActiveCard("Vehículo") : setActiveCard("");
    }, [create, setActiveCard]);

    useEffect(() => {
        activeCard !== "Vehículo" && setCreate(false);
    }, [activeCard]);

    return (
        <Container in={vehiculos.data[0].clienteId !== 0}>
            <SwitchTransition>
                <Section
                    key={vehiculos.data[0].clienteId}
                    overlay={
                        activeCard === "Vehículo" || activeCard === "Cliente"
                            ? true
                            : false
                    }
                    onClick={() => {
                        setActiveCard("");
                    }}
                >
                    <Create
                        type="Vehículo"
                        active={
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
                            edit={
                                activeCard === "Vehículo" && create
                                    ? true
                                    : false
                            }
                            unEdit={() => {
                                setCreate(false);
                            }}
                        />
                    </Create>
                    <TransitionGroup component={null}>
                        {vehiculos.data[0] && vehiculos.data[0].id !== 0 ? (
                            vehiculos.data.map((aVehiculo) => (
                                <Card
                                    key={aVehiculo.id}
                                    active={
                                        vehiculoId === aVehiculo.id
                                            ? true
                                            : false
                                    }
                                    edit={
                                        vehiculoId === aVehiculo.id &&
                                        activeCard === "Vehículo" &&
                                        !create
                                            ? true
                                            : false
                                    }
                                    onEdit={() => setActiveCard("Vehículo")}
                                    remove={remove}
                                    onRemove={() => {
                                        setRemove(true);
                                    }}
                                >
                                    <Box
                                        vehiculo={aVehiculo}
                                        onClick={() =>
                                            vehiculoId === aVehiculo.id
                                                ? setVehiculoId(0)
                                                : setVehiculoId(aVehiculo.id)
                                        }
                                    />
                                    {vehiculoId === aVehiculo.id && !create && (
                                        <>
                                            <VehiculoForm
                                                vehiculo={aVehiculo}
                                                edit={
                                                    activeCard === "Vehículo"
                                                        ? true
                                                        : false
                                                }
                                                unEdit={() => {
                                                    setActiveCard("");
                                                }}
                                            />
                                            <Remove
                                                id={aVehiculo.id}
                                                service="clientes"
                                                remove={remove}
                                                unRemove={() => {
                                                    setRemove(false);
                                                }}
                                            />
                                        </>
                                    )}
                                </Card>
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
