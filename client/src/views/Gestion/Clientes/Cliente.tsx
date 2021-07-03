import React, { useEffect, useState } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import Card from "components/Card";

type Props = {
    readonly error?: boolean;
};

const Box = styled.article`
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto;

    div {
        display: grid;
        gap: 0.5rem;
    }

    div:last-child {
        text-align: right;
    }
`;

const Form = styled.aside`
    grid-template-columns: 1fr 1fr;
`;

const Label = styled.label<Props>`
    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error);
        `};
`;

const Cliente = function ({
    activeSection,
    setActiveSection,
    setActiveId,
    cliente,
}) {
    const [inputs, setInputs] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        email: "",
        empresa: "",
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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
                .then((data) => {
                    setActiveId(data.id);
                    setMessage("Cliente creado");
                    setTimeout(function () {
                        setMessage("");
                    }, 3000);
                })
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
                .then(() => {
                    setMessage("Cliente guardado");
                    setTimeout(function () {
                        setMessage("");
                    }, 5500);
                })
                .catch((error) => {
                    console.error(error);
                });
    };

    const handleDelete = (event) => {
        event.preventDefault();
        setActiveId(0);
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
        <Card
            type="Cliente"
            message={message}
            active={true}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            create={cliente.id === 0 ? true : false}
            onSubmit={cliente.id === 0 ? handleCreate : handleEdit}
            onReset={handleDelete}
        >
            {cliente.id !== 0 && (
                <Box>
                    <div>
                        <h2>
                            {cliente.nombre} {cliente.apellido}
                        </h2>
                        {cliente.empresa && <h5> {cliente.empresa}</h5>}
                    </div>
                    <div>
                        {cliente.dni && (
                            <label>
                                DNI / CUIT / CUIL N°
                                <span>{cliente.dni}</span>
                            </label>
                        )}
                        {cliente.telefono && (
                            <label>
                                Telefono
                                <span>{cliente.telefono}</span>
                            </label>
                        )}
                        {cliente.email && (
                            <label>
                                Email
                                <span>{cliente.email} </span>
                            </label>
                        )}
                    </div>
                </Box>
            )}
            <Form>
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
            </Form>
        </Card>
    );
};

export default Cliente;
