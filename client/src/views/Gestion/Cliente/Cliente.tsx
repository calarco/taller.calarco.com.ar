import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { useGestion } from "views/Gestion/context";
import CardComponent from "components/Card";
import Box from "./Box";
import Form from "./Form";
import Remove from "./Remove";

const Card = transition(CardComponent).attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    
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

const Cliente = function ({ createCliente }) {
    const {
        clienteId,
        setClienteId,
        setVehiculoId,
        activeCard,
        setActiveCard,
    } = useGestion();
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
        (last?: boolean) => {
            last
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
        clienteId !== 0 && loadCliente();
    }, [clienteId, loadCliente]);

    return cliente.id && cliente.id !== 0 ? (
        <SwitchTransition>
            <Card
                key={cliente.id}
                active={true}
                edit={activeCard === "Cliente" ? true : false}
                onEdit={() => setActiveCard("Cliente")}
                onRemove={() => {
                    setRemove(true);
                }}
            >
                <Box
                    cliente={cliente}
                    onClose={() => {
                        setClienteId(0);
                        setVehiculoId(0);
                    }}
                />
                <Form
                    cliente={
                        createCliente
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
                />
                <Remove
                    id={cliente.id}
                    remove={remove}
                    unRemove={() => {
                        setRemove(false);
                    }}
                />
            </Card>
        </SwitchTransition>
    ) : (
        <Form
            cliente={{
                id: 0,
                nombre: "",
                apellido: "",
                dni: "",
                empresa: "",
                telefono: "",
                email: "",
                createdAt: "",
                updatedAt: "",
            }}
            edit={activeCard === "Cliente" ? true : false}
            unEdit={() => {
                setActiveCard("");
            }}
        />
    );
};

export default Cliente;
