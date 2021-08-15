import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import Vehiculo from "./Vehiculo";

type Props = {
    readonly state?: string;
};

const Container = styled.section<Props>`
    content-visibility: auto;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    padding: 1rem 1.5rem;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: 0.3s ease-out;

    ${(props) =>
        props.state &&
        props.state !== "entered" &&
        css`
            visibility: hidden;
            opacity: 0;
            transition: 0.3s ease-in;
        `};
`;

const Empty = styled.h5`
    padding: 2rem;
    text-align: center;
    color: var(--on-background-variant);
`;

const Cliente = styled.div`
    position: relative;
    width: 100%;
    padding: 1.5rem 2.5rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    transition: 0.1s ease-in;
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
    align-items: center;
    justify-content: start;

    &:hover {
        cursor: pointer;
        background: var(--on-background-disabled);
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

const Busqueda = function ({
    busqueda,
    setClienteId,
    setVehiculoId,
    matchModelo,
    state,
}) {
    const [clientes, setClientes] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                apellido: "",
                telefono: " ",
                direccion: "",
                empresa: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
    const [vehiculos, setVehiculos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                patente: "",
                year: "",
                combustible: "",
                cilindrada: "",
                createdAt: "",
                updatedAt: "",
                clienteId: 0,
                modeloId: 0,
            },
        ],
    });

    useEffect(() => {
        busqueda === ""
            ? feathersClient
                  .service("clientes")
                  .find({
                      query: {
                          $limit: 50,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((clientes) => {
                      setClientes(clientes);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  }) &&
              feathersClient
                  .service("vehiculos")
                  .find({
                      query: {
                          $limit: 50,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((vehiculos) => {
                      setVehiculos(vehiculos);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  })
            : feathersClient
                  .service("clientes")
                  .find({
                      query: {
                          $or: [
                              { nombre: { $iLike: `${busqueda}%` } },
                              { apellido: { $iLike: `${busqueda}%` } },
                          ],
                          $limit: 10,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((clientes) => {
                      setClientes(clientes);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  }) &&
              feathersClient
                  .service("vehiculos")
                  .find({
                      query: {
                          patente: { $iLike: `${busqueda}%` },
                          $limit: 10,
                          $sort: {
                              updatedAt: -1,
                          },
                      },
                  })
                  .then((vehiculos) => {
                      setVehiculos(vehiculos);
                  })
                  .catch((error) => {
                      console.log("error", error);
                  });
    }, [busqueda]);

    return (
        <>
            <Container state={state}>
                {busqueda === "" ? (
                    vehiculos.data[0] &&
                    vehiculos.data[0].id !== 0 &&
                    vehiculos.data.map((aVehiculo) => (
                        <Vehiculo
                            key={aVehiculo.id}
                            vehiculo={aVehiculo}
                            setClienteId={setClienteId}
                            setVehiculoId={setVehiculoId}
                            matchModelo={matchModelo}
                        />
                    ))
                ) : vehiculos.data[0] || clientes.data[0] ? (
                    <>
                        {vehiculos.data.map((aVehiculo) => (
                            <Vehiculo
                                key={aVehiculo.id}
                                vehiculo={aVehiculo}
                                setClienteId={setClienteId}
                                setVehiculoId={setVehiculoId}
                                matchModelo={matchModelo}
                            />
                        ))}
                        {clientes.data.map((aCliente) => (
                            <Cliente
                                key={aCliente.id}
                                onClick={() => {
                                    setClienteId(aCliente.id);
                                    setVehiculoId(0);
                                }}
                            >
                                <h4>
                                    {aCliente.nombre} {aCliente.apellido}
                                </h4>
                            </Cliente>
                        ))}
                    </>
                ) : (
                    <Empty>No se encontraron resultados</Empty>
                )}
            </Container>
        </>
    );
};

export default Busqueda;
