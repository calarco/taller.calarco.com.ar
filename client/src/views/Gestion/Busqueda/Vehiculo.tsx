import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

type Props = {
    readonly active?: boolean;
};

const Container = styled.div<Props>`
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    transition: 0.15s ease-in;

    &:hover {
        cursor: pointer;
        transition: 0.15s ease-out;
    }

    &::after {
        content: "";
        position: absolute;
        top: 0;
        z-index: 0;
        width: 100%;
        border-top: var(--border-variant);
    }

    div {
        padding: 1.5rem 2.5rem;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        gap: 1rem;

        &:hover {
            cursor: pointer;
            background: var(--primary-variant);
            transition: 0.15s ease-out;
        }
    }

    h5 {
        position: relative;
        padding: 1.5rem 2.5rem;
        border: 1px solid rgba(0, 0, 0, 0);
        text-align: right;
        transition: 0.15s ease-in;

        &:hover {
            cursor: pointer;
            background: var(--primary-variant);
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

        ${(props) =>
            props.active &&
            css`
                background: var(--primary-variant);
                transition: 0.15s ease-out;
            `};
    }
`;

const Vehiculo = function ({
    vehiculo,
    active,
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
        <Container active={active}>
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
