import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import { useGestion } from "views/Gestion/gestionContext";
import { useCarName } from "views/Gestion/carNameContext";

type Props = {
    readonly active?: boolean;
};

const Container = styled.div`
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    transition: 0.15s ease-in;

    &:not(:first-child)::after {
        content: "";
        position: absolute;
        top: 0;
        z-index: 0;
        width: 100%;
        border-top: var(--border-variant);
    }
`;

const Box = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-content: start;

    &:hover {
        cursor: pointer;
        background: var(--primary-variant);
        transition: 0.15s ease-out;
    }

    > p {
        position: relative;
        width: 8.5rem;
        text-align: center;
        text-transform: uppercase;
        font-family: var(--font-family-alt);
        color: var(--on-background-variant);

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            right: 0;
            height: 2rem;
            border-right: var(--border-variant);
        }
    }

    div {
        padding: 1.5rem 2.5rem;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        gap: 1rem;
    }

    h4 {
        font: 400 1rem/1.75rem var(--font-family-alt);
    }
`;

const Cliente = styled.h5<Props>`
    position: relative;
    padding: 1.5rem 2.5rem;
    border: 1px solid rgba(0, 0, 0, 0);
    display: grid;
    transition: 0.15s ease-in;

    ${(props) =>
        !props.active &&
        css`
            &:hover {
                cursor: pointer;
                background: var(--primary-variant);
                transition: 0.15s ease-out;
            }
        `};

    ${(props) =>
        props.active &&
        css`
            background: var(--primary-variant);
            transition: 0.15s ease-out;
        `};
`;

const VehiculoBox = function ({ vehiculo, active }) {
    const { setClienteId, setVehiculoId } = useGestion();
    const { getCarName } = useCarName();
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
            <Box
                onClick={() => {
                    setVehiculoId(vehiculo.id);
                    setClienteId(vehiculo.clienteId);
                }}
            >
                <p>
                    {vehiculo.updatedAt.substring(8, 10)}
                    <span>
                        {new Date(vehiculo.updatedAt)
                            .toLocaleDateString("default", {
                                month: "short",
                            })
                            .substring(0, 3)}
                    </span>
                </p>
                <div>
                    <h4>{vehiculo.patente}</h4>
                    <p>{getCarName(vehiculo.modeloId)}</p>
                </div>
            </Box>
            <Cliente
                active={active}
                onClick={() => {
                    active ? setClienteId(0) : setClienteId(cliente.id);
                }}
            >
                {cliente.nombre} {cliente.apellido}
            </Cliente>
        </Container>
    );
};

export default VehiculoBox;
