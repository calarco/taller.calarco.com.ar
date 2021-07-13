import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import { SwitchTransition, Transition } from "react-transition-group";

import Card from "components/Card";
import ClienteBox from "./ClienteBox";
import ClienteForm from "views/Gestion/Cliente/ClienteForm";

const Cliente = function ({ clienteId, activeCard, setActiveCard }) {
    const nodeRef = React.useRef(null);

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
                            {clienteId === 0 ? (
                                <Card
                                    type="Cliente"
                                    create={true}
                                    active={true}
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                    state={state}
                                >
                                    <ClienteForm
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
                                        onCancel={() => {
                                            setActiveCard("");
                                        }}
                                    />
                                </Card>
                            ) : (
                                <Card
                                    type="Cliente"
                                    create={false}
                                    active={true}
                                    activeCard={activeCard}
                                    setActiveCard={setActiveCard}
                                    state={state}
                                >
                                    <ClienteBox cliente={cliente} />
                                    <ClienteForm
                                        cliente={cliente}
                                        onCancel={() => {
                                            setActiveCard("");
                                        }}
                                    />
                                </Card>
                            )}
                        </>
                    )}
                </Transition>
            </SwitchTransition>
        </>
    );
};

export default Cliente;
