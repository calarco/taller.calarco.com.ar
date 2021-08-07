import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";

import Section from "components/Section";
import Card from "components/Card";
import Box from "./Box";
import Actions from "./Actions";

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
                primary={true}
                active={activeCard === "" ? true : false}
                onClick={() => {
                    setActiveCard("");
                }}
                state={state}
            >
                <Card
                    type="Reparación"
                    create={true}
                    active={false}
                    edit={activeCard === "Reparación" && create ? true : false}
                    onEdit={() => setCreate(true)}
                    onRemove={() => {
                        setRemove(true);
                    }}
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
                </Card>
                {reparaciones.data[0].id !== 0 &&
                    reparaciones.data.map((aReparacion) => (
                        <Card
                            key={aReparacion.id}
                            type="Reparación"
                            create={false}
                            active={selected === aReparacion.id ? true : false}
                            edit={
                                selected === aReparacion.id &&
                                activeCard === "Reparación" &&
                                !create
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
