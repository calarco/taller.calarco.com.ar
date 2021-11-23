import React from "react";
import styled from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import useTurnos from "Gestion/hooks/useTurnos";
import Day from "./Day";

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

type ComponentProps = {
    indexMonth: number;
    item: { year: number; month: number; days: number[] };
    selected: string;
    setSelected: (selected: string) => void;
};

const Turnos = function ({
    item,
    indexMonth,
    selected,
    setSelected,
}: ComponentProps) {
    const { activeCard } = useActive();
    const { turnos } = useTurnos();

    return (
        <>
            <Mes>
                <h4>
                    {new Date(item.year, item.month, 1).toLocaleDateString(
                        "default",
                        {
                            month: "long",
                        }
                    )}
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
                    isCurrent={indexMonth === 0 && indexDay === 0}
                    isActive={
                        selected ===
                            `${item.year}-${(item.month + 1)
                                .toString()
                                .padStart(2, "0")}-${number
                                .toString()
                                .padStart(2, "0")}` && activeCard === "Turno"
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
                />
            ))}
        </>
    );
};

export default Turnos;
