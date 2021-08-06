import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import { SwitchTransition, Transition } from "react-transition-group";

import Card from "components/Card";
import Box from "./Box";
import Actions from "./Actions";

const Cliente = function ({
    clienteId,
    create,
    setCreate,
    activeCard,
    setActiveCard,
}) {
    const nodeRef = React.useRef(null);
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

    const loadCliente = useCallback(() => {
        feathersClient
            .service("clientes")
            .get(clienteId)
            .then((found) => {
                setCliente(found);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [clienteId]);

    useEffect(() => {
        setRemove(false);
        clienteId !== 0 && loadCliente();
    }, [clienteId, loadCliente]);

    return (
        <>
            <SwitchTransition>
                <Transition
                    nodeRef={nodeRef}
                    key={cliente.id}
                    addEndListener={(nodeRef, done) => {
                        nodeRef.addEventListener("transitionend", done, false);
                    }}
                >
                    {(state) => (
                        <>
                            <Card
                                type="Cliente"
                                create={false}
                                active={true}
                                edit={activeCard === "Cliente" ? true : false}
                                onEdit={() => setActiveCard("Cliente")}
                                onRemove={() => {
                                    setRemove(true);
                                }}
                                state={state}
                            >
                                <Box cliente={cliente} />
                                {cliente.id === 0 || create ? (
                                    <Actions
                                        key={0}
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
                                        edit={true}
                                        unEdit={() => {
                                            setCreate(false);
                                        }}
                                        remove={remove}
                                        unRemove={() => {
                                            setRemove(false);
                                        }}
                                    />
                                ) : (
                                    <Actions
                                        key={cliente.id}
                                        cliente={cliente}
                                        edit={
                                            activeCard === "Cliente"
                                                ? true
                                                : false
                                        }
                                        unEdit={() => {
                                            setActiveCard("");
                                        }}
                                        remove={remove}
                                        unRemove={() => {
                                            setRemove(false);
                                        }}
                                    />
                                )}
                            </Card>
                        </>
                    )}
                </Transition>
            </SwitchTransition>
        </>
    );
};

export default Cliente;
