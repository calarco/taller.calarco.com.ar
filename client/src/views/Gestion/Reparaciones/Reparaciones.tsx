import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import SectionComponent from "components/Section";
import Create from "components/Create";
import Card from "components/Card";
import Box from "./Box";
import Actions from "./Actions";

const Section = styled(SectionComponent)`
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 2;
    grid-row-end: 2;
    min-height: 21.5rem;
    background: var(--surface);
    border-top: var(--border-variant);
    box-shadow: var(--shadow);

    ${(props) =>
        props.overlay &&
        css`
            background: none;
            box-shadow: none;
        `};
`;

const Reparaciones = function ({
    vehiculoId,
    activeCard,
    setActiveCard,
    state,
}) {
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
                    found.data[0]
                        ? setReparaciones(found)
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
        vehiculoId !== 0 && loadReparaciones();
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
        <>
            <Section
                overlay={activeCard !== "" ? true : false}
                onClick={() => {
                    setActiveCard("");
                }}
                state={state}
            >
                <Create
                    type="Reparación"
                    edit={activeCard === "Reparación" && create ? true : false}
                    onEdit={() => setCreate(true)}
                    state={state}
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
                            activeCard === "Reparación" && create ? true : false
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
                {reparaciones.data[0].id !== 0 &&
                    reparaciones.data.map((aReparacion) => (
                        <Card
                            key={aReparacion.id}
                            active={selected === aReparacion.id ? true : false}
                            edit={
                                !create &&
                                selected === aReparacion.id &&
                                (activeCard === "Reparación" || remove)
                                    ? true
                                    : false
                            }
                            onEdit={() => setActiveCard("Reparación")}
                            onRemove={() => {
                                setRemove(true);
                            }}
                            state={state}
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
                                        activeCard === "Reparación" && !create
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
            </Section>
        </>
    );
};

export default Reparaciones;
