import React from "react";
import styled from "styled-components";

const Container = styled.article`
    padding: 1rem 1.5rem;
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr auto;
    align-items: center;

    div:first-child {
        display: grid;
        gap: 0.5rem;
        align-items: top;
    }

    div:last-child {
        display: grid;
        justify-items: end;
        gap: 0.5rem 1rem;
    }
`;

type ComponentProps = {
    cliente: Cliente;
};

const ClienteBox = function ({ cliente }: ComponentProps) {
    return (
        <Container>
            <div>
                <h2>
                    {cliente.nombre} {cliente.apellido}
                </h2>
                {cliente.email && <p>{cliente.email}</p>}
            </div>
            <div>
                {cliente.dni && (
                    <label>
                        DNI
                        <span>{cliente.dni}</span>
                    </label>
                )}
                {cliente.telefono && (
                    <label>
                        Telefono
                        <span>{cliente.telefono}</span>
                    </label>
                )}
                {cliente.empresa && (
                    <label>
                        Empresa
                        <span>{cliente.empresa}</span>
                    </label>
                )}
            </div>
        </Container>
    );
};

export default ClienteBox;
