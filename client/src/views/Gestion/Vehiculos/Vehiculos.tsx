import React, { useState, useEffect, useCallback, useTransition } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import Section from "components/Section";
import CreateComponent from "components/Create";
import CardComponent from "components/Card";
import Box from "./Box";
import Actions from "./Actions";

const Create = styled(CreateComponent)`
    ${(props) =>
        props.edit &&
        css`
            bottom: 16rem;
        `};
`;

const Card = styled(CardComponent)`
    ${(props) =>
        props.edit &&
        css`
            bottom: 16rem;
        `};
`;

const Loading = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.25rem;
    background: var(--primary);
`;

const Side = function ({
    clienteId,
    vehiculoId,
    setVehiculoId,
    activeCard,
    setActiveCard,
    matchModelo,
}) {
    const nodeRef = React.useRef(null);
    const [isPending, startTransition] = useTransition();
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
        clienteId !== 0 &&
            startTransition(() => {
                loadVehiculos();
            });
    }, [clienteId, setVehiculoId, startTransition, loadVehiculos]);

    useEffect(() => {
        setRemove(false);
    }, [vehiculoId]);

    useEffect(() => {
        activeCard !== "Vehículo" && setCreate(false);
    }, [activeCard]);

    useEffect(() => {
        create ? setActiveCard("Vehículo") : setActiveCard("");
    }, [create, setActiveCard]);

    return (
        <>
            <Section
                overlay={
                    activeCard === "Vehículo" || activeCard === "Cliente"
                        ? true
                        : false
                }
                onClick={() => {
                    setActiveCard("");
                }}
            >
                <SwitchTransition>
                    <Transition
                        nodeRef={nodeRef}
                        key={clienteId}
                        addEndListener={(nodeRef, done) => {
                            nodeRef.addEventListener(
                                "transitionend",
                                done,
                                false
                            );
                        }}
                    >
                        {(state) => (
                            <>
                                {clienteId !== 0 ? (
                                    <>
                                        <Create
                                            type="Vehículo"
                                            edit={
                                                activeCard === "Vehículo" &&
                                                create
                                                    ? true
                                                    : false
                                            }
                                            onEdit={() => {
                                                setCreate(true);
                                            }}
                                            state={state}
                                        >
                                            {create && (
                                                <Actions
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
                                                        activeCard ===
                                                            "Vehículo" && create
                                                            ? true
                                                            : false
                                                    }
                                                    unEdit={() => {
                                                        setCreate(false);
                                                    }}
                                                    remove={false}
                                                    unRemove={() => {
                                                        setRemove(false);
                                                    }}
                                                />
                                            )}
                                        </Create>
                                        {vehiculos.data[0] &&
                                            vehiculos.data.map((aVehiculo) => (
                                                <Card
                                                    key={aVehiculo.id}
                                                    active={
                                                        vehiculoId ===
                                                        aVehiculo.id
                                                            ? true
                                                            : false
                                                    }
                                                    edit={
                                                        !create &&
                                                        vehiculoId ===
                                                            aVehiculo.id &&
                                                        (activeCard ===
                                                            "Vehículo" ||
                                                            remove)
                                                            ? true
                                                            : false
                                                    }
                                                    onEdit={() =>
                                                        setActiveCard(
                                                            "Vehículo"
                                                        )
                                                    }
                                                    onRemove={() => {
                                                        setRemove(true);
                                                    }}
                                                >
                                                    <Box
                                                        vehiculo={aVehiculo}
                                                        onClick={() =>
                                                            setVehiculoId(
                                                                aVehiculo.id
                                                            )
                                                        }
                                                        matchModelo={
                                                            matchModelo
                                                        }
                                                    />
                                                    {vehiculoId ===
                                                        aVehiculo.id && (
                                                        <Actions
                                                            vehiculo={aVehiculo}
                                                            edit={
                                                                !create &&
                                                                activeCard ===
                                                                    "Vehículo"
                                                                    ? true
                                                                    : false
                                                            }
                                                            unEdit={() => {
                                                                setActiveCard(
                                                                    ""
                                                                );
                                                            }}
                                                            remove={remove}
                                                            unRemove={() => {
                                                                setRemove(
                                                                    false
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </Card>
                                            ))}
                                    </>
                                ) : (
                                    <div>Presupuestos</div>
                                )}
                            </>
                        )}
                    </Transition>
                </SwitchTransition>
            </Section>
            {isPending ? <Loading /> : null}
        </>
    );
};

export default Side;
