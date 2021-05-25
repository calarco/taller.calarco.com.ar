import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import feathersClient from "feathersClient";

import Reparacion from "./Reparacion";

const Container = styled.section`
    position: relative;
    grid-area: reparaciones;
    padding: 40px;
    background: var(--surface);
    box-shadow: var(--shadow0);
    border-top: var(--border);
    border-right: var(--border);
    border-left: var(--border-variant);
    border-radius: 0 4px 2px 0;
    transition: 0.25s ease-in;
`;

const Reparaciones = function ({ selected, setSelected }) {
    const [reparaciones, setReparaciones] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: "",
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
            .service("api/reparaciones")
            .find({
                query: {
                    vehiculoId: selected.vehiculoId,
                    $limit: 100,
                    $sort: {
                        createdAt: -1,
                    },
                },
            })
            .then((data) => {
                setReparaciones(data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [selected.vehiculoId]);

    useEffect(() => {
        loadReparaciones();
        feathersClient
            .service("api/reparaciones")
            .on("created", () => loadReparaciones());
        feathersClient
            .service("api/reparaciones")
            .on("removed", () => loadReparaciones());
    }, [selected.vehiculoId, loadReparaciones]);

    return (
        <>
            <Container>
                <Reparacion
                    reparacion={{
                        id: "0",
                        vehiculoId: "",
                        reparacion: "",
                        repuestos: "",
                        labor: "",
                        costo: "",
                        km: "",
                        createdAt: "",
                        updatedAt: "",
                    }}
                    lastkm={reparaciones.data[0] ? reparaciones.data[0].km : ""}
                    selected={selected}
                    setSelected={setSelected}
                />
                {reparaciones.data.map((aReparacion) => (
                    <Reparacion
                        key="aReparacion.id"
                        reparacion={aReparacion}
                        lastkm={
                            reparaciones.data[0] ? reparaciones.data[0].km : ""
                        }
                        selected={selected}
                        setSelected={setSelected}
                    />
                ))}
            </Container>
        </>
    );
};

export default Reparaciones;
