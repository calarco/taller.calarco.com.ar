import React from "react";
import styled from "styled-components";

const Container = styled.article`
    padding: 1rem 1.5rem;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 4.25rem 1fr;
    gap: 1rem;

    h4 {
        text-align: right;
    }

    div {
        display: grid;
        gap: 0.5rem;
    }
`;

const VehiculoBox = function ({ vehiculo, onClick, matchModelo }) {
    return (
        <Container onClick={onClick}>
            <h4>{vehiculo.patente}</h4>
            <div>
                <h6>{matchModelo(vehiculo.modeloId)}</h6>
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
