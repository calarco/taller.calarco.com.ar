import React from "react";
import styled from "styled-components";

const Container = styled.article`
    padding: 1rem 1rem 1.25rem 1rem;
    display: grid;
    gap: 1rem;

    div:first-child {
        padding-left: 0.75rem;
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr auto;
        align-items: center;
    }

    div:last-child {
        padding: 0 0.75rem;
        display: grid;
        grid-template-columns: auto auto;
        justify-content: space-between;
        gap: 0.5rem 1rem;
    }

    button {
        margin: 0;
        padding: 0.5rem 1rem;
        background: var(--surface);
        border: var(--border-variant);
    }
`;

const ClienteBox = function ({ cliente, onClose }) {
    return (
        <Container>
            <div>
                <h2>
                    {cliente.nombre} {cliente.apellido}
                    {cliente.dni && <small>{cliente.dni}</small>}
                </h2>
                <button type="button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
            <div>
                {cliente.email && (
                    <label>
                        Email
                        <span>{cliente.email}</span>
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
