import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

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
    padding: 1.5rem;
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

const Resultado = styled.div`
    width: 100%;
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid var(--on-background-disabled);
    transition: 0.1s ease-in;
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
    align-items: center;
    justify-content: start;

    &:hover {
        cursor: pointer;
        background: var(--on-background-disabled);
        transition: 0.15s ease-out;
    }

    h4 {
        text-align: right;
    }

    div {
        pointer-events: none;
        display: grid;
    }
`;

const Busqueda = function ({ busqueda, setClienteId, setVehiculoId, state }) {
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
                  .then(() => {})
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
                  });
    }, [busqueda]);

    return (
        <>
            <Container state={state}>
                {clientes.data.map((aCliente) => (
                    <Resultado
                        key={aCliente.id}
                        onClick={() => {
                            setClienteId(aCliente.id);
                            setVehiculoId(0);
                        }}
                        tabIndex={0}
                    >
                        <h4>
                            {aCliente.nombre} {aCliente.apellido}
                        </h4>
                        <div>
                            <p>{aCliente.telefono}</p>
                        </div>
                    </Resultado>
                ))}
            </Container>
        </>
    );
};

export default Busqueda;
