import React, { useState, useEffect, useCallback, useTransition } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";

import Section from "components/Section";
import Card from "components/Card";
import VehiculoBox from "./VehiculoBox";
import VehiculoForm from "views/Gestion/Vehiculos/VehiculoForm";

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

    const loadVehiculos = useCallback(() => {
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
            })
            .catch((error) => {
                console.error(error);
            });
    }, [clienteId]);

    useEffect(() => {
        feathersClient
            .service("vehiculos")
            .on("created", () => loadVehiculos());
        feathersClient
            .service("vehiculos")
            .on("patched", () => loadVehiculos());
        feathersClient
            .service("vehiculos")
            .on("removed", () => loadVehiculos());
    }, [loadVehiculos]);

    useEffect(() => {
        clienteId !== 0 &&
            startTransition(() => {
                loadVehiculos();
            });
    }, [clienteId, startTransition, loadVehiculos]);

    return (
        <>
            <Section
                primary={false}
                active={
                    activeCard === "Vehículo" || activeCard === "Cliente"
                        ? false
                        : true
                }
                onClick={() => {
                    setActiveCard("");
                }}
            >
                <SwitchTransition>
                    <Transition
                        nodeRef={nodeRef}
                        key={vehiculos.data[0].id}
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
                                        <Card
                                            type="Vehículo"
                                            create={true}
                                            active={
                                                !vehiculos.data[0]
                                                    ? true
                                                    : false
                                            }
                                            activeCard={activeCard}
                                            setActiveCard={setActiveCard}
                                            state={state}
                                        >
                                            <VehiculoForm
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
                                                onCancel={() => {
                                                    setActiveCard("");
                                                }}
                                            />
                                        </Card>
                                        {vehiculos.data[0] &&
                                            vehiculos.data.map((aVehiculo) => (
                                                <Card
                                                    key={aVehiculo.id}
                                                    type="Vehículo"
                                                    create={false}
                                                    active={
                                                        vehiculoId ===
                                                        aVehiculo.id
                                                            ? true
                                                            : false
                                                    }
                                                    activeCard={activeCard}
                                                    setActiveCard={
                                                        setActiveCard
                                                    }
                                                    state={state}
                                                >
                                                    <VehiculoBox
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
                                                        <VehiculoForm
                                                            vehiculo={aVehiculo}
                                                            onCancel={() => {
                                                                setActiveCard(
                                                                    ""
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
