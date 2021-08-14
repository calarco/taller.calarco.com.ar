import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";

const Container = styled.div`
    position: relative;
    width: 100%;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: 0.1s ease-in;
    display: grid;
    grid-template-columns: 1fr auto;

    div {
        padding: 1.5rem 2.5rem;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        gap: 1rem;

        &:hover {
            cursor: pointer;
            background: var(--on-background-disabled);
            transition: 0.15s ease-out;
        }
    }

    h5 {
        position: relative;
        padding: 1.5rem 2.5rem;
        text-align: right;

        &:hover {
            cursor: pointer;
            background: var(--on-background-disabled);
            transition: 0.15s ease-out;
        }

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: var(--border-variant);
        }
    }

    &:hover {
        cursor: pointer;
        border: var(--border);
        transition: 0.15s ease-out;
    }

    &:not(:first-child)::after {
        content: "";
        position: absolute;
        top: -0.75rem;
        z-index: 0;
        width: 100%;
        border-top: var(--border-variant);
    }
`;

const Vehiculo = function ({
    vehiculo,
    setClienteId,
    setVehiculoId,
    matchModelo,
}) {
    const [cliente, setCliente] = useState({
        id: 0,
        nombre: "",
        apellido: "",
        telefono: " ",
        direccion: "",
        empresa: "",
        createdAt: "",
        updatedAt: "",
    });

    useEffect(() => {
        feathersClient
            .service("clientes")
            .get(vehiculo.clienteId)
            .then((found) => {
                setCliente(found);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [vehiculo]);

    return (
        <Container>
            <div
                onClick={() => {
                    setVehiculoId(vehiculo.id);
                    setClienteId(vehiculo.clienteId);
                }}
            >
                <h4>{vehiculo.patente}</h4>
                <p>{matchModelo(vehiculo.modeloId)}</p>
            </div>
            <h5 onClick={() => setClienteId(cliente.id)}>
                {cliente.nombre} {cliente.apellido}
            </h5>
        </Container>
    );
};

export default Vehiculo;
