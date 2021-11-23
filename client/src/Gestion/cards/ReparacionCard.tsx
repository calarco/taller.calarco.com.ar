import React, { MouseEvent, useState, useEffect } from "react";
import styled, { css } from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import CardComponent from "components/Card";
import ReparacionBox from "./ReparacionBox";
import ReparacionForm from "Gestion/forms/ReparacionForm";
import Remove from "components/Remove";

type Props = {
    isForm?: boolean;
};

const Card = styled(CardComponent)`
    ${(props: Props) =>
        props.isForm &&
        css`
            bottom: 3rem;
        `};
`;

type ComponentProps = {
    reparacion: Reparacion;
    isActive: boolean;
    setActive: (e: MouseEvent<HTMLDivElement>) => void;
    className?: string;
};

const ReparacionCard = function ({
    reparacion,
    isActive,
    setActive,
    className,
}: ComponentProps) {
    const { activeCard, setActiveCard } = useActive();

    const [form, setForm] = useState(false);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        form ? setActiveCard("Reparación") : setActiveCard("");
    }, [form, setActiveCard]);

    useEffect(() => {
        activeCard !== "Reparación" && setForm(false);
    }, [activeCard]);

    useEffect(() => {
        setForm(false);
        setRemove(false);
    }, [isActive]);

    return (
        <Card
            isActive={isActive}
            isRemove={remove}
            setRemove={() => setRemove(true)}
            isForm={form}
            setForm={() => setForm(true)}
            className={className}
        >
            <ReparacionBox reparacion={reparacion} onClick={setActive} />
            <ReparacionForm
                reparacion={reparacion}
                isActive={isActive && form ? true : false}
            />
            <Remove
                id={reparacion.id}
                service="reparaciones"
                isActive={remove}
                exit={() => {
                    setRemove(false);
                }}
            />
        </Card>
    );
};

export default ReparacionCard;
