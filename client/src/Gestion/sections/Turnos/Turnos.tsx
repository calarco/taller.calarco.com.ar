import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import useTurnos from "Gestion/hooks/useTurnos";
import SectionComponent from "components/Section";
import Day from "./Day";

const Section = styled(SectionComponent)`
    padding: 0;
    gap: 0;
`;

const Mes = styled.div`
    position: sticky;
    top: 0;
    z-index: 900;
    width: 100%;
    min-height: 3rem;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    background: var(--surface-t);
    backdrop-filter: blur(0.4rem);
    box-shadow: var(--shadow);
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

type ComponentProps = {
    overlay: boolean;
};

const Turnos = function ({ overlay }: ComponentProps) {
    const { activeCard, setActiveCard } = useActive();
    const { turnos } = useTurnos();

    const loader = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState("");

    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const days: number[] = [];
    for (
        var i = new Date().getDate();
        i <= 32 - new Date(year, month, 32).getDate();
        i++
    ) {
        days.push(i);
    }
    const [calendar, setCalendar] = useState([
        { year: year, month: month, days: days },
    ]);

    const loadDays = useCallback(() => {
        const previousMonth = calendar[calendar.length - 1].month;
        const previousYear = calendar[calendar.length - 1].year;
        const month = previousMonth === 11 ? 0 : previousMonth + 1;
        const year = previousMonth === 11 ? previousYear + 1 : previousYear;
        const days: number[] = [];

        for (var i = 1; i <= 32 - new Date(year, month, 32).getDate(); i++) {
            days.push(i);
        }

        setCalendar((calendar) => [
            ...calendar,
            {
                year: year,
                month: month,
                days: days,
            },
        ]);
        setLoading(false);
    }, [calendar]);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setLoading(true);
        }
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
        loading && loadDays();
    }, [loading, loadDays]);

    useEffect(() => {
        selected !== "" ? setActiveCard("Turno") : setActiveCard("");
    }, [selected, setActiveCard]);

    useEffect(() => {
        activeCard !== "Turno" && setSelected("");
    }, [activeCard]);

    useEffect(() => {
        setActiveCard("");
    }, [turnos, setActiveCard]);

    return (
        <Section
            overlay={
                activeCard === "Turno" || activeCard === "Cliente" || overlay
                    ? true
                    : false
            }
            onClick={() => {
                setActiveCard("");
            }}
        >
            {calendar.map((item, indexMonth) => (
                <>
                    <Mes
                        key={`${item.year}-${(item.month + 1)
                            .toString()
                            .padStart(2, "0")}`}
                    >
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
                    {item.days.map((number, indexDay) => (
                        <Day
                            key={`${item.year}-${(item.month + 1)
                                .toString()
                                .padStart(2, "0")}-${number
                                .toString()
                                .padStart(2, "0")}`}
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
                            current={indexMonth === 0 && indexDay === 0}
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
