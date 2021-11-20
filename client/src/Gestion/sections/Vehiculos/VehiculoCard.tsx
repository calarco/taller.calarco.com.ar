import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import CardComponent from "components/Card";
import VehiculoBox from "./VehiculoBox";
import VehiculoForm from "Gestion/forms/VehiculoForm";
import Remove from "components/Remove";

type Props = {
    isForm?: boolean;
};

const Card = styled(CardComponent)`
    ${(props: Props) =>
        props.isForm &&
        css`
            bottom: 15rem;
        `};
`;

type ComponentProps = {
    vehiculo: Vehiculo;
    className?: string;
};

const VehiculoCard = function ({ vehiculo, className }: ComponentProps) {
    const { vehiculoId, activeCard, setActiveCard } = useActive();

    const [form, setForm] = useState(false);
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        form ? setActiveCard("Vehículo") : setActiveCard("");
    }, [form, setActiveCard]);

    useEffect(() => {
        activeCard !== "Vehículo" && setForm(false);
    }, [activeCard]);

    useEffect(() => {
        setRemove(false);
    }, [vehiculoId]);

    return (
        <Card
            isActive={vehiculoId === vehiculo.id ? true : false}
            isRemove={remove}
            setRemove={() => setRemove(true)}
            isForm={form}
            setForm={() => setForm(true)}
            className={className}
        >
            <VehiculoBox vehiculo={vehiculo} />
            <VehiculoForm
                vehiculo={vehiculo}
                isActive={vehiculoId === vehiculo.id && form ? true : false}
            />
            <Remove
                id={vehiculo.id}
                service="vehiculos"
                isActive={vehiculoId === vehiculo.id && remove}
                exit={() => {
                    setRemove(false);
                }}
            />
        </Card>
    );
};

export default VehiculoCard;
