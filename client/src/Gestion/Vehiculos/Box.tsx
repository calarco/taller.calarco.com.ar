import React from "react";
import styled from "styled-components";

import { useCarName } from "Gestion/carNameContext";

const Container = styled.article`
    padding: 1rem 1.5rem;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 4.5rem 1fr;
    align-items: center;
    gap: 1rem;

    h4 {
        text-align: right;
        font: 400 1rem/1.75rem var(--font-family-alt);
    }

    div {
        display: grid;
        gap: 0.5rem;
    }
`;

const VehiculoBox = function ({ vehiculo, onClick }) {
    const { getCarName } = useCarName();

    return (
        <Container onClick={onClick}>
            <h4>{vehiculo.patente}</h4>
            <div>
                <h6>{getCarName(vehiculo.modeloId)}</h6>
                <p>
                    {vehiculo.combustible} {vehiculo.cilindrada}
                    <small>{vehiculo.year}</small>
                </p>
            </div>
            <p>{vehiculo.vin}</p>
        </Container>
    );
};

export default VehiculoBox;
