import React, { useState, useEffect, useCallback, useRef } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import SectionComponent from "components/Section";
import CreateComponent from "components/Create";
import Actions from "./Actions";

const Section = styled(SectionComponent)`
    grid-row-end: span 2;
    padding: 0;
    gap: 0;
`;

const Mes = styled.div`
    position: sticky;
    top: 0;
    z-index: 900;
    width: 100%;
    height: 3rem;
    padding: 0 1.5rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(0.4rem);
    box-shadow: var(--shadow-variant);
    border-bottom: var(--border-variant);
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    text-transform: capitalize;

    h6 {
        color: var(--on-background-variant);
    }
`;

type ActiveProps = {
    active?: boolean;
    inactive?: boolean;
};

const Day = styled.div<ActiveProps>`
    position: relative;
    padding: 0.75rem 2rem;
    display: grid;
    align-items: start;
    grid-template-columns: 3rem 1fr;
    gap: 1.5rem;
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

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 1rem;
        left: 1rem;
        z-index: 0;
        border-bottom: var(--border-variant);

        ${(props) =>
            props.active &&
            css`
                transition: 0.2s ease-out;
                border-bottom: 1px solid rgba(0, 0, 0, 0);
            `};
    }
`;

const Dia = styled.div<ActiveProps>`
    position: relative;
    height: 3rem;
    padding: 0 0.5rem;
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

    ${(props) =>
        props.inactive &&
        css`
            & > * {
                color: var(--on-background-disabled);
            }
        `};
`;

const List = styled.div`
    position: relative;
    border-radius: 4px;
    display: flex;
    flex-direction: column;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        border-left: var(--border-variant);
    }
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
`;

const Turno = styled.div`
    padding: 1rem 1.5rem;

    &:nth-child(2) {
        border-top: var(--border-variant);
    }
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
    const [selected, setSelected] = useState("");
    const [create, setCreate] = useState(false);
    const [remove, setRemove] = useState(false);

    const [calendar, setCalendar] = useState([
        { year: 0, month: 0, days: [0] },
    ]);
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
        const list: number[] = [];
        for (
            var i = 1;
            i <=
            32 -
                new Date(
                    calendar[calendar.length - 1].month === 11
                        ? calendar[calendar.length - 1].year + 1
                        : calendar[calendar.length - 1].year,
                    calendar[calendar.length - 1].month + 1,
                    32
                ).getDate();
            i++
        ) {
            list.push(i);
        }
        setCalendar((calendar) => [
            ...calendar,
            {
                year:
                    calendar[calendar.length - 1].month === 11
                        ? calendar[calendar.length - 1].year + 1
                        : calendar[calendar.length - 1].year,
                month: calendar[calendar.length - 1].month + 1,
                days: list,
            },
        ]);
    }, [calendar]);

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
        setCalendar([
            {
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                days: currentList,
            },
        ]);
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
                {calendar.map((item) => (
                    <>
                        <Mes key={`${item.year}-${item.month}`}>
                            <h4>
                                {new Date(
                                    item.year,
                                    item.month,
                                    1
                                ).toLocaleDateString("default", {
                                    month: "long",
                                })}
                            </h4>
                            <h6>{item.year}</h6>
                        </Mes>
                        {item.days.map((number, index) => (
                            <Day
                                key={`${item.year}-${item.month}-${number}`}
                                active={
                                    selected ===
                                        `${item.year}-${item.month}-${number}` &&
                                    activeCard === "Turno"
                                }
                            >
                                <Dia
                                    active={index === 0}
                                    inactive={
                                        [0, 6].indexOf(
                                            new Date(
                                                item.year,
                                                item.month,
                                                number
                                            ).getDay()
                                        ) !== -1
                                    }
                                    onClick={() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                >
                                    <h3>{number}</h3>
                                    <p>
                                        {new Date(
                                            item.year,
                                            item.month,
                                            number
                                        ).toLocaleDateString("default", {
                                            weekday: "short",
                                        })}
                                    </p>
                                </Dia>
                                <List>
                                    <Create
                                        type="Turno"
                                        active={
                                            selected ===
                                                `${item.year}-${item.month}-${number}` &&
                                            activeCard === "Turno"
                                        }
                                        onClick={() => {
                                            setCreate(true);
                                            setSelected(
                                                `${item.year}-${item.month}-${number}`
                                            );
                                        }}
                                    >
                                        <Actions
                                            turno={{
                                                id: 0,
                                                fecha: `${item.year}-${(
                                                    item.month + 1
                                                )
                                                    .toString()
                                                    .padStart(2, "0")}-${number
                                                    .toString()
                                                    .padStart(2, "0")}`,
                                                motivo: "",
                                                createdAt: "",
                                                updatedAt: "",
                                                modeloId: 0,
                                            }}
                                            edit={
                                                selected ===
                                                    `${item.year}-${item.month}-${number}` &&
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
                                                ) ===
                                                    `${item.year}-${(
                                                        item.month + 1
                                                    )
                                                        .toString()
                                                        .padStart(
                                                            2,
                                                            "0"
                                                        )}-${number
                                                        .toString()
                                                        .padStart(2, "0")}` && (
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
