import React, { useEffect, useState } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

type Props = {
    readonly create?: boolean;
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly error?: boolean;
};

const Form = styled.form<Props>`
    will-change: opacity;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-0.75rem);
    grid-template-columns: 1fr 1fr;
    content-visibility: auto;
    position: absolute;
    z-index: 1500;
    top: -1px;
    left: -1px;
    right: -1px;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid var(--primary);
    box-shadow: var(--shadow);
    background: var(--primary);
    display: grid;
    gap: 1px;
    align-items: start;
    transition: 0.25s ease-in;

    label {
        height: 100%;
        padding: 0.5rem 1rem;
        background: var(--surface);
    }

    ${(props) =>
        props.edit &&
        css`
            visibility: visible;
            opacity: 1;
            transform: initial;
            transition: 0.3s ease-in;
        `};
`;

const Label = styled.label<Props>`
    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error);
        `};
`;

const Remove = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 3rem;
    left: 1px;
    padding: 1.25rem 2.25rem;
    border-radius: 4px 4px 0 0;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(0.5rem);
    display: grid;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
    transition: 0.25s ease-in;

    ${(props) =>
        props.active &&
        css`
            visibility: visible;
            opacity: 1;
            transition: 0.3s ease-in;
        `};
`;

const Buttons = styled.div<Props>`
    grid-row: 4;
    grid-column-start: 1;
    grid-column-end: span 2;
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    background: var(--surface);
    display: flex;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        margin: 0;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;
        border: none;

        &:not(:first-child)::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: var(--border);
        }
    }
`;

const ClienteForm = function ({ cliente, edit, unEdit, remove, unRemove }) {
    const [inputs, setInputs] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        email: "",
        empresa: "",
    });
    const [error, setError] = useState("");

    const capitalize = (text) => {
        if (typeof text !== "string") return "";
        return text
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
    };

    function validate(inputs) {
        let error = "";
        inputs.nombre === ""
            ? (error = "Ingrese un nombre")
            : inputs.apellido === ""
            ? (error = "Ingrese un apellido")
            : (error = "");
        return error;
    }

    const handleCreate = (event) => {
        event.preventDefault();
        setError(validate(inputs));
        validate(inputs) === "" &&
            feathersClient
                .service("clientes")
                .create({
                    nombre: inputs.nombre,
                    apellido: inputs.apellido,
                    dni: inputs.dni,
                    empresa: inputs.empresa,
                    telefono: inputs.telefono,
                    email: inputs.email,
                    createdAt: Date(),
                    updatedAt: Date(),
                })
                .then(() => {})
                .catch((error) => {
                    console.error(error);
                });
    };

    const handleEdit = (event) => {
        event.preventDefault();
        setError(validate(inputs));
        validate(inputs) === "" &&
            feathersClient
                .service("clientes")
                .patch(cliente.id, {
                    nombre: inputs.nombre,
                    apellido: inputs.apellido,
                    dni: inputs.dni,
                    empresa: inputs.empresa,
                    telefono: inputs.telefono,
                    email: inputs.email,
                })
                .then(() => {})
                .catch((error) => {
                    console.error(error);
                });
    };

    const handleDelete = (event) => {
        event.preventDefault();
        feathersClient
            .service("clientes")
            .remove(cliente.id)
            .then(() => {})
            .catch((error) => {
                console.error(error);
            });
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]:
                event.target.name === "nombre" ||
                event.target.name === "apellido"
                    ? capitalize(event.target.value)
                    : event.target.name === "email"
                    ? event.target.value.toLowerCase()
                    : event.target.value,
        }));
    };

    useEffect(() => {
        cliente.id !== 0 &&
            setInputs({
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                dni: cliente.dni || "",
                empresa: cliente.empresa || "",
                telefono: cliente.telefono || "",
                email: cliente.email || "",
            });
    }, [cliente]);

    return (
        <>
            <Form
                edit={edit}
                onSubmit={cliente.id === 0 ? handleCreate : handleEdit}
                onReset={handleDelete}
                noValidate
            >
                <Label error={error === "" ? false : true}>
                    {error === "" ? "Nombre" : error}
                    <input
                        type="text"
                        name="nombre"
                        placeholder="-"
                        autoComplete="off"
                        value={inputs.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </Label>
                <Label error={error === "" ? false : true}>
                    {error === "" ? "Apellido" : error}
                    <input
                        type="text"
                        name="apellido"
                        placeholder="-"
                        autoComplete="off"
                        value={inputs.apellido}
                        onChange={handleInputChange}
                        required
                    />
                </Label>
                <label>
                    DNI / CUIT / CUIL
                    <input
                        type="text"
                        name="dni"
                        placeholder="-"
                        autoComplete="off"
                        value={inputs.dni}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Empresa
                    <input
                        type="text"
                        name="empresa"
                        placeholder="-"
                        autoComplete="off"
                        value={inputs.empresa}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Telefono
                    <input
                        type="tel"
                        pattern="\d*"
                        name="telefono"
                        placeholder="-"
                        autoComplete="off"
                        value={inputs.telefono}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Correo electrónico
                    <input
                        type="email"
                        name="email"
                        placeholder="-"
                        autoComplete="off"
                        value={inputs.email}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <Buttons create={cliente.id === 0 ? true : false}>
                    {cliente.id === 0 ? (
                        <>
                            <button type="button" onClick={unEdit}>
                                Cancelar
                            </button>
                            <button type="submit" onClick={() => {}}>
                                Crear cliente
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={unEdit}>
                                Cancelar
                            </button>
                            <button type="submit" onClick={() => {}}>
                                Guardar
                            </button>
                        </>
                    )}
                </Buttons>
            </Form>
            {cliente.id !== 0 && (
                <Remove active={remove}>
                    <h5>¿Borrar cliente?</h5>
                    <Buttons>
                        <button type="button" onClick={unRemove}>
                            Cancelar
                        </button>
                        <button type="reset" onClick={() => {}}>
                            Borrar
                        </button>
                    </Buttons>
                </Remove>
            )}
        </>
    );
};

export default ClienteForm;
