import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import feathersClient from "feathersClient";

const Container = styled.div`
    grid-area: cliente;
    position: relative;
    border-radius: 4px 4px 0 0;
    background: var(--surface);
    box-shadow: var(--shadow0);
    border-top: var(--border);
    border-right: var(--border);
    border-left: var(--border);

    article {
        padding: 16px 40px;
    }
`;

const Buttons = styled.div`
    width: 100%;
    text-align: center;
    display: flex;

    button {
        width: 100%;
        transition: 0.25s ease-in;
    }
`;

const Cliente = function ({ id }) {
    const [open, setOpen] = useState(false);
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
            .service("api/clientes")
            .get(id)
            .then((cliente) => {
                setCliente(cliente);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [id]);

    useEffect(() => {
        loadCliente();
        feathersClient
            .service("api/clientes")
            .on("created", () => loadCliente());
        feathersClient
            .service("api/clientes")
            .on("removed", () => loadCliente());
    }, [id, loadCliente]);

    return (
        <>
            <Container>
                {open ? (
                    <article>
                        <label>
                            Nombre
                            <input
                                type="text"
                                name="nombre"
                                placeholder="-"
                                autoComplete="off"
                                required
                            />
                        </label>
                        <label>
                            Apellido
                            <input
                                type="text"
                                name="apellido"
                                placeholder="-"
                                autoComplete="off"
                                required
                            />
                        </label>
                    </article>
                ) : (
                    <article>
                        <h2>
                            {cliente.nombre} {cliente.apellido}
                            <h5> {cliente.empresa}</h5>
                        </h2>
                        <h5>
                            {cliente.telefono} <h5>marcelo@calarco.com.ar</h5>
                        </h5>
                    </article>
                )}
                <Buttons>
                    {open ? (
                        <>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Cancelar
                            </button>
                            <button type="submit" onClick={() => setOpen(true)}>
                                Guardar
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Borrar
                            </button>
                            <button onClick={() => setOpen(true)}>
                                Editar
                            </button>
                        </>
                    )}
                </Buttons>
            </Container>
        </>
    );
};

export default Cliente;
