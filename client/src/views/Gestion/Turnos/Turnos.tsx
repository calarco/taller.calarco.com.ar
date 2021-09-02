import React, { useState, useEffect, useCallback, useRef } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";

import SectionComponent from "components/Section";
import Day from "./Day";

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
        selected !== "" ? setActiveCard("Turno") : setActiveCard("");
    }, [selected, setActiveCard]);

    useEffect(() => {
        activeCard !== "Turno" && setSelected("");
    }, [activeCard]);

    return (
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
                    {item.days.map((number) => (
                        <Day
                            key={`${item.year}-${(item.month + 1)
                                .toString()
                                .padStart(2, "0")}-${number
                                .toString()
                                .padStart(2, "0")}`}
                            matchModelo={matchModelo}
                            date={[item.year, item.month, number]}
                            turnos={turnos.data.filter(
                                ({ fecha }) =>
                                    fecha.substring(0, 10) ===
                                    `${item.year}-${(item.month + 1)
                                        .toString()
                                        .padStart(2, "0")}-${number
                                        .toString()
                                        .padStart(2, "0")}`
                            )}
                            active={
                                selected ===
                                    `${item.year}-${(item.month + 1)
                                        .toString()
                                        .padStart(2, "0")}-${number
                                        .toString()
                                        .padStart(2, "0")}` &&
                                activeCard === "Turno"
                            }
                            setActive={() => {
                                setSelected(
                                    `${item.year}-${(item.month + 1)
                                        .toString()
                                        .padStart(2, "0")}-${number
                                        .toString()
                                        .padStart(2, "0")}`
                                );
                            }}
                            unActive={() => setActiveCard("")}
                        />
                    ))}
                </>
            ))}
            <Loading ref={loader}>Loading...</Loading>
        </Section>
    );
};

export default Turnos;
