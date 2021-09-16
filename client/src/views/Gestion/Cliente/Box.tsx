import React from "react";
import styled from "styled-components";

const Container = styled.article`
    padding-bottom: 1.25rem;
    display: grid;
    gap: 1rem;

    div:first-child {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr auto;
        align-items: top;

        h2 {
            padding-top: 1.25rem;
            padding-left: 2rem;
        }
    }

    div:last-child {
        padding: 0 2rem;
        display: grid;
        grid-template-columns: auto auto;
        justify-content: space-between;
        gap: 0.5rem 1rem;
    }

    button {
        height: 3rem;
        padding: 0.5rem 1.5rem;
        border-radius: 0 0 0 4px;
        background: var(--surface);
        border: var(--border-primary);
        border-top: none;
        border-right: none;
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
