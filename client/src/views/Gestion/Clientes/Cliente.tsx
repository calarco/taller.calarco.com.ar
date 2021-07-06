import React from "react";
import styled from "styled-components";

const Container = styled.article`
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto;

    div {
        display: grid;
        gap: 0.5rem;
    }

    div:last-child {
        text-align: right;
    }
`;

const Cliente = function ({ cliente }) {
    return (
        <Container>
            <div>
                <h2>
                    {cliente.nombre} {cliente.apellido}
                </h2>
                {cliente.empresa && <h5> {cliente.empresa}</h5>}
            </div>
            <div>
                {cliente.dni && (
                    <label>
                        DNI / CUIT / CUIL N°
                        <span>{cliente.dni}</span>
                    </label>
                )}
                {cliente.telefono && (
                    <label>
                        Telefono
                        <span>{cliente.telefono}</span>
                    </label>
                )}
                {cliente.email && (
                    <label>
                        Email
                        <span>{cliente.email} </span>
                    </label>
                )}
            </div>
        </Container>
    );
};

export default Cliente;
