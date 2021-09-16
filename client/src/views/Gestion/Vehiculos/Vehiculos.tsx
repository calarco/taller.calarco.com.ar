import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition, TransitionGroup } from "react-transition-group";

import SectionComponent from "components/Section";
import Create from "components/Create";
import CardComponent from "components/Card";
import Box from "./Box";
import Form from "./Form";
import Remove from "./Remove";

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

    ${(props) =>
        props.edit &&
        css`
            bottom: 16rem;
        `};
`;

const Empty = styled.h5`
    padding: 2rem;
    text-align: center;
    color: var(--on-background-variant);
`;

const Vehiculos = function ({
    clienteId,
    vehiculoId,
    setVehiculoId,
    activeCard,
    setActiveCard,
    matchModelo,
}) {
    const [count, setCount] = useState(0);
    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

    const [vehiculos, setVehiculos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                patente: "",
                year: "",
                combustible: "",
                cilindrada: "",
                createdAt: "",
                updatedAt: "",
                clienteId: 0,
                modeloId: 0,
            },
        ],
    });

    const loadVehiculos = useCallback(
        (setId?: boolean) => {
            feathersClient
                .service("vehiculos")
                .find({
                    query: {
                        $limit: 100,
                        clienteId: clienteId,
                        $sort: {
                            updatedAt: -1,
                        },
                    },
                })
                .then((found) => {
                    setCount((count) => count + 1);
                    setVehiculos(found);
                    setActiveCard("");
                    setId && setVehiculoId(found.data[0].id);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        [clienteId, setActiveCard, setVehiculoId]
    );

    useEffect(() => {
        feathersClient
            .service("vehiculos")
            .on("created", () => loadVehiculos(true));
        feathersClient
            .service("vehiculos")
            .on("patched", () => loadVehiculos());
        feathersClient.service("vehiculos").on("removed", () => {
            loadVehiculos();
            setVehiculoId(0);
        });
    }, [loadVehiculos, setVehiculoId]);

    useEffect(() => {
        loadVehiculos();
    }, [clienteId, loadVehiculos]);

    useEffect(() => {
        setRemove(false);
    }, [vehiculoId]);

    useEffect(() => {
        create ? setActiveCard("Vehículo") : setActiveCard("");
    }, [create, setActiveCard]);

    useEffect(() => {
        activeCard !== "Vehículo" && setCreate(false);
    }, [activeCard]);

    return count !== 0 ? (
        <SwitchTransition>
            <Section
                key={count}
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
                    active={activeCard === "Vehículo" && create ? true : false}
                    onClick={() => {
                        setCreate(true);
                    }}
                >
                    <Form
                        vehiculo={{
                            id: 0,
                            patente: "",
                            year: "",
                            combustible: "Nafta",
                            cilindrada: "",
                            createdAt: "",
                            updatedAt: "",
                            clienteId: clienteId,
                            modeloId: 0,
                        }}
                        edit={
                            activeCard === "Vehículo" && create ? true : false
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
                                    vehiculoId === aVehiculo.id ? true : false
                                }
                                edit={
                                    !create &&
                                    vehiculoId === aVehiculo.id &&
                                    activeCard === "Vehículo"
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
                                    matchModelo={matchModelo}
                                />
                                {vehiculoId === aVehiculo.id && (
                                    <>
                                        <Form
                                            vehiculo={aVehiculo}
                                            edit={
                                                !create &&
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
    ) : (
        <></>
    );
};

export default Vehiculos;
