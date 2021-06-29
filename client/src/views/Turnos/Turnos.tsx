import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import feathersClient from "feathersClient";

import { Device } from "components/globalStyle";
import Turno from "./Turno";
import NuevoTurno from "./NuevoTurno";

const Container = styled.section`
    width: 100%;
    max-height: 100vh;
    padding: 0px 40px;
    background: var(--surface);
    box-shadow: var(--shadow);
    border-left: var(--border);
    overflow-y: overlay;

    @media ${Device.laptop} {
    }
`;

const Mes = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    padding: 8px 0;
    background: var(--surface);
    text-transform: capitalize;
    border-bottom: var(--border);
`;

type ActiveProps = {
    readonly active?: boolean;
};

const Dia = styled.div<ActiveProps>`
    position: sticky;
    top: 0;
    padding: 8px 0px 8px 0;
    text-transform: uppercase;
    display: grid;
    align-items: top;
    grid-template-columns: auto 1fr;

    ${(props) =>
        props.active &&
        css`
            p,
            h3 {
                color: var(--secondary);
            }
        `};
`;

const Turnos = function ({ matchModelo }) {
    const [turnos, setTurnos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                fecha: "",
                motivo: "",
                createdAt: "1994-01-20T00:00:00",
                updatedAt: "1994-01-20T00:00:00",
                modeloId: 0,
            },
        ],
    });

    function loadTurnos() {
        feathersClient
            .service("api/turnos")
            .find({
                query: {
                    fecha: {
                        $gt: new Date().getTime() - 24 * 60 * 60 * 1000,
                    },
                    $limit: 50,
                    $sort: {
                        fecha: 1,
                    },
                },
            })
            .then((data) => {
                setTurnos(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        loadTurnos();
        feathersClient.service("api/turnos").on("created", () => loadTurnos());
        feathersClient.service("api/turnos").on("removed", () => loadTurnos());
    }, []);

    return (
        <>
            <Container>
                {turnos.data[0] && turnos.data[0].id !== 0 ? (
                    turnos.data.map((aTurno, index, array) => (
                        <>
                            {index === 0 ||
                            aTurno.fecha.substring(0, 8) !==
                                array[index - 1].fecha.substring(0, 8) ? (
                                <Mes>
                                    <h4>
                                        {new Date(
                                            aTurno.fecha
                                        ).toLocaleDateString("default", {
                                            month: "long",
                                        })}
                                    </h4>
                                </Mes>
                            ) : undefined}
                            {index === 0 ||
                            aTurno.fecha.substring(0, 10) !==
                                array[index - 1].fecha.substring(0, 10) ? (
                                <Dia
                                    key={aTurno.id}
                                    active={
                                        aTurno.fecha.substring(0, 10) ===
                                        new Date()
                                            .toISOString()
                                            .substring(0, 10)
                                            ? true
                                            : false
                                    }
                                >
                                    <div>
                                        <h3>{aTurno.fecha.substring(8, 10)}</h3>
                                        <p>
                                            {new Date(
                                                aTurno.fecha
                                            ).toLocaleDateString("default", {
                                                weekday: "short",
                                            })}
                                        </p>
                                    </div>
                                    <NuevoTurno />
                                </Dia>
                            ) : undefined}
                            <Turno turno={aTurno} matchModelo={matchModelo} />
                        </>
                    ))
                ) : (
                    <div>
                        <i className="material-icons md-inactive md-48">
                            event
                        </i>
                        <h6>No hay turnos agendados</h6>
                    </div>
                )}
            </Container>
        </>
    );
};

export default Turnos;
