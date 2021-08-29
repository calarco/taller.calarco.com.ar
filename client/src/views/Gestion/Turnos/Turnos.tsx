import React, { useState, useEffect, useCallback, useRef } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import SectionComponent from "components/Section";
import CreateComponent from "components/Create";
import Actions from "./Actions";

const Section = styled(SectionComponent)`
    grid-row-end: span 2;
    padding: 0;
`;

const Mes = styled.h4`
    position: sticky;
    top: 0;
    z-index: 900;
    width: 100%;
    height: 3rem;
    padding: 0 1.5rem;
    border-radius: 4px 4px 0 0;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(0.4rem);
    box-shadow: var(--shadow-variant);
    border-top: var(--border-variant);
    display: grid;
    text-transform: capitalize;
`;

type ActiveProps = {
    active?: boolean;
};

const Day = styled.div<ActiveProps>`
    padding: 0 1.5rem;
    display: grid;
    align-items: start;
    grid-template-columns: 3rem 1fr;
    gap: 1rem;
    transition: 0.15s ease-in;

    ${(props) =>
        props.active &&
        css`
            position: sticky;
            top: 0;
            bottom: 17rem;
            z-index: 1500;
            transition: 0.2s ease-out;
        `};
`;

const Dia = styled.div<ActiveProps>`
    padding: 0 0.5rem 0.25rem 0.5rem;
    text-transform: uppercase;
    text-align: center;
    display: grid;
    grid-template-rows: auto auto;

    ${(props) =>
        props.active &&
        css`
            & > * {
                color: var(--secondary);
            }
        `};
`;

const List = styled.div`
    position: relative;
    border-radius: 4px;
    border: var(--border-variant);
    display: flex;
    flex-direction: column;
`;

const Create = styled(CreateComponent)`
    position: relative;
    backdrop-filter: none;
    background: none;
    border: none;
    box-shadow: none;

    &:hover {
        border: none;
    }

    &::after {
        content: "";
        position: absolute;
        right: 1rem;
        bottom: 0;
        left: 1rem;
        z-index: 0;
        border-bottom: var(--border-variant);
    }
`;

const Turno = styled.div`
    padding: 1rem 1.5rem;
`;

const Loading = styled.div`
    @keyframes loading {
        0% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.5;
        }
    }

    padding: 2rem 0;
    text-align: center;
    animation-name: loading;
    animation-duration: 2s;
    animation-iteration-count: infinite;
`;

const Turnos = function ({ activeCard, setActiveCard, matchModelo }) {
    const loader = useRef<HTMLDivElement | null>(null);
    const [selected, setSelected] = useState(0);
    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

    const [days, setDays] = useState([{ month: 0, days: [0] }]);
    const [turnos, setTurnos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                fecha: "",
                motivo: "",
                createdAt: "",
                updatedAt: "",
                modeloId: 0,
            },
        ],
    });

    const loadDays = useCallback(() => {
        const monthDays =
            32 -
            new Date(
                new Date().getFullYear(),
                days[days.length - 1].month + 1,
                32
            ).getDate();
        const list: number[] = [];
        for (var i = 1; i <= monthDays; i++) {
            list.push(i);
        }
        setDays((days) => [
            ...days,
            { month: days[days.length - 1].month + 1, days: list },
        ]);
    }, []);

    const handleObserver = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                loadDays();
            }
        },
        [loadDays]
    );

    const loadTurnos = useCallback(() => {
        feathersClient
            .service("turnos")
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
                setActiveCard("");
            })
            .catch((error) => {
                console.error(error);
            });
    }, [setActiveCard]);

    useEffect(() => {
        const today = new Date().getDate();
        const currentMonthDays =
            32 -
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                32
            ).getDate();
        const currentList: number[] = [];
        for (var i = today; i <= currentMonthDays; i++) {
            currentList.push(i);
        }
        setDays([{ month: new Date().getMonth(), days: currentList }]);
    }, []);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0,
        };
        loader.current &&
            new IntersectionObserver(handleObserver, option).observe(
                loader.current
            );
    }, [handleObserver]);

    useEffect(() => {
        loadTurnos();
        feathersClient.service("turnos").on("created", () => loadTurnos());
        feathersClient.service("turnos").on("removed", () => loadTurnos());
    }, [loadTurnos]);

    useEffect(() => {
        create ? setActiveCard("Turno") : setActiveCard("");
    }, [create, setActiveCard]);

    useEffect(() => {
        activeCard !== "Turno" && setCreate(false);
    }, [activeCard]);

    return (
        <>
            <Section
                overlay={
                    activeCard === "Turno" || activeCard === "Cliente"
                        ? true
                        : false
                }
                onClick={() => {
                    setActiveCard("");
                }}
            >
                {days.map((month) => (
                    <>
                        <Mes>
                            {new Date(2021, month.month, 1).toLocaleDateString(
                                "default",
                                {
                                    month: "long",
                                }
                            )}
                        </Mes>
                        {month.days.map((day, index) => (
                            <Day
                                key={day}
                                active={
                                    selected === day && activeCard === "Turno"
                                }
                            >
                                <Dia
                                    active={index === 0}
                                    onClick={() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                >
                                    <h3>{day}</h3>
                                    <p>
                                        {new Date(
                                            new Date().getFullYear(),
                                            new Date().getMonth(),
                                            day
                                        ).toLocaleDateString("default", {
                                            weekday: "short",
                                        })}
                                    </p>
                                </Dia>
                                <List>
                                    <Create
                                        type="Turno"
                                        active={
                                            selected === day &&
                                            activeCard === "Turno"
                                        }
                                        onClick={() => {
                                            setCreate(true);
                                            setSelected(day);
                                        }}
                                    >
                                        <Actions
                                            turno={{
                                                id: 0,
                                                fecha: `2021-08-${day}`,
                                                motivo: "",
                                                createdAt: "",
                                                updatedAt: "",
                                                modeloId: 0,
                                            }}
                                            edit={
                                                selected === day &&
                                                activeCard === "Turno" &&
                                                create
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
                                    </Create>
                                    {turnos.data[0] &&
                                        turnos.data[0].id !== 0 &&
                                        turnos.data.map(
                                            (aTurno) =>
                                                aTurno.fecha.substring(
                                                    0,
                                                    10
                                                ) === `2021-08-${day}` && (
                                                    <Turno key={aTurno.id}>
                                                        <h6>
                                                            {aTurno.motivo}
                                                            <span>
                                                                {matchModelo(
                                                                    aTurno.modeloId
                                                                )}
                                                            </span>
                                                        </h6>
                                                    </Turno>
                                                )
                                        )}
                                </List>
                            </Day>
                        ))}
                    </>
                ))}
                <Loading ref={loader}>Loading...</Loading>
            </Section>
        </>
    );
};

export default Turnos;
