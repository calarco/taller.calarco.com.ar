import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";

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
    border-radius: 4px;
    background: var(--surface);
    border-top: var(--border);
    box-shadow: var(--shadow);
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
                km: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });

    const loadReparaciones = useCallback(() => {
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
                                  km: "",
                                  createdAt: "",
                                  updatedAt: "",
                              },
                          ],
                      });
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [vehiculoId]);

    useEffect(() => {
        feathersClient
            .service("reparaciones")
            .on("created", () => loadReparaciones());
        feathersClient
            .service("reparaciones")
            .on("patched", () => loadReparaciones());
        feathersClient
            .service("reparaciones")
            .on("removed", () => loadReparaciones());
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
                active={activeCard === "" ? true : false}
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
