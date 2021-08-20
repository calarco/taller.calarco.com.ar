import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import CardComponent from "components/Card";
import Box from "./Box";
import Actions from "./Actions";

const Card = transition(CardComponent).attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
    
    &:enter {
        opacity: 0;
    }

    &:enter-active {
        opacity: 1;
        transition: 0.3s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transition: 0.15s ease-in;
    }

    ${(props) =>
        (props.active || props.edit) &&
        css`
            position: relative;
            top: 0;
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            overflow: visible;
            backdrop-filter: none;
            background: var(--surface);
            border: none;
            box-shadow: var(--shadow);

            &:hover {
                cursor: default;
                border: none;
                transition: 0.2s ease-in;
            }

            &:not(:first-child)::after {
                border-top: none;
            }
        `};
`;

const Cliente = function ({
    clienteId,
    setClienteId,
    setVehiculoId,
    create,
    activeCard,
    setActiveCard,
}) {
    const [remove, setRemove] = useState(false);

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

    const loadCliente = useCallback(
        (setId?: boolean) => {
            setId
                ? feathersClient
                      .service("clientes")
                      .find({
                          query: {
                              $limit: 1,
                              $sort: {
                                  updatedAt: -1,
                              },
                          },
                      })
                      .then((found) => {
                          setCliente(found.data[0]);
                          setClienteId(found.data[0].id);
                          setVehiculoId(0);
                          setActiveCard("");
                      })
                      .catch((error) => {
                          console.error(error);
                      })
                : feathersClient
                      .service("clientes")
                      .get(clienteId)
                      .then((found) => {
                          setCliente(found);
                          setActiveCard("");
                      })
                      .catch((error) => {
                          console.log("error", error);
                      });
        },
        [clienteId, setClienteId, setVehiculoId, setActiveCard]
    );

    useEffect(() => {
        feathersClient
            .service("clientes")
            .on("created", () => loadCliente(true));
        feathersClient.service("clientes").on("patched", () => loadCliente());
        feathersClient.service("clientes").on("removed", () => setClienteId(0));
    }, [loadCliente, setClienteId]);

    useEffect(() => {
        setRemove(false);
        clienteId !== 0
            ? loadCliente()
            : setCliente({
                  id: 0,
                  nombre: "",
                  apellido: "",
                  telefono: " ",
                  direccion: "",
                  empresa: "",
                  createdAt: "",
                  updatedAt: "",
              });
    }, [clienteId, loadCliente]);

    return (
        <SwitchTransition>
            <Card
                key={clienteId}
                active={true}
                edit={activeCard === "Cliente" ? true : false}
                onEdit={() => setActiveCard("Cliente")}
                onRemove={() => {
                    setRemove(true);
                }}
            >
                <Box cliente={cliente} />
                <Actions
                    cliente={
                        create
                            ? {
                                  id: 0,
                                  nombre: "",
                                  apellido: "",
                                  dni: "",
                                  empresa: "",
                                  telefono: "",
                                  email: "",
                                  createdAt: "",
                                  updatedAt: "",
                              }
                            : cliente
                    }
                    edit={activeCard === "Cliente" ? true : false}
                    unEdit={() => {
                        setActiveCard("");
                    }}
                    remove={remove}
                    unRemove={() => {
                        setRemove(false);
                    }}
                />
            </Card>
        </SwitchTransition>
    );
};

export default Cliente;
