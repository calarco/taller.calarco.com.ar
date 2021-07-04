import React, { useEffect, useState } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";

import Modelo from "./Modelo";
import Card from "components/Card";

const Form = styled.aside`
    grid-template-columns: 1fr 1fr 1fr;
`;

const Wide = styled.label`
    grid-column-end: span 2;
`;

const Vehiculo = function ({
    matchModelo,
    active,
    activeCard,
    setActiveCard,
    setActiveId,
    onClick,
    vehiculo,
}) {
    const [inputs, setInputs] = useState({
        patente: "",
        year: "",
        combustible: "Nafta",
        cilindrada: "",
        vin: "",
        clienteId: 0,
        fabricanteId: 0,
        fabricante: "",
        modeloId: 0,
        modelo: "",
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
        inputs.modeloId === 0
            ? (error = "Seleccione un modelo")
            : inputs.patente === ""
            ? (error = "Ingrese la patente")
            : inputs.year === ""
            ? (error = "Ingrese el año")
            : inputs.vin === ""
            ? (error = "")
            : /\s/.test(inputs.vin)
            ? (error = "El vin no puede contener espacios")
            : inputs.vin && inputs.vin.includes("O")
            ? (error = "El vin no puede contener la letra O")
            : inputs.vin && inputs.vin.includes("I")
            ? (error = "El vin no puede contener la letra I")
            : inputs.vin && inputs.vin.includes("Q")
            ? (error = "El vin no puede contener la letra Q")
            : inputs.vin && inputs.vin.length !== 17
            ? (error = "El VIN debe contener 17 caracteres")
            : (error = "");
        setError(error);
        return error;
    }

    const handleCreate = (event) => {
        event.preventDefault();
        validate(inputs) === "" &&
            feathersClient
                .service("vehiculos")
                .create({
                    patente: inputs.patente,
                    year: inputs.year,
                    combustible: inputs.combustible,
                    cilindrada: inputs.cilindrada,
                    vin: inputs.vin,
                    clienteId: inputs.clienteId,
                    modeloId: inputs.modeloId,
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
        validate(inputs) === "" &&
            feathersClient
                .service("vehiculos")
                .patch(vehiculo.id, {
                    patente: inputs.patente,
                    year: inputs.year,
                    combustible: inputs.combustible,
                    cilindrada: inputs.cilindrada,
                    vin: inputs.vin,
                    clienteId: inputs.clienteId,
                    modeloId: inputs.modeloId,
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
            .service("vehiculos")
            .remove(vehiculo.id)
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
                event.target.name === "patente" || event.target.name === "vin"
                    ? event.target.value.toUpperCase()
                    : event.target.name === "fabricante" ||
                      event.target.name === "modelo"
                    ? capitalize(event.target.value)
                    : event.target.value,
        }));
    };

    useEffect(() => {
        setInputs({
            patente: vehiculo.patente,
            year: vehiculo.year || "",
            combustible: vehiculo.combustible,
            cilindrada: vehiculo.cilindrada || "",
            vin: vehiculo.vin || "",
            clienteId: vehiculo.clienteId,
            fabricanteId: 0,
            fabricante: "",
            modeloId: vehiculo.modeloId,
            modelo: "",
        });
    }, [vehiculo]);

    return (
        <>
            <Card
                type="Vehículo"
                message={message}
                active={active}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                create={vehiculo.id === 0 ? true : false}
                onSubmit={vehiculo.id === 0 ? handleCreate : handleEdit}
                onReset={handleDelete}
                data={vehiculo}
                matchModelo={matchModelo}
                onClick={onClick}
            >
                <Form>
                    <Modelo
                        inputs={inputs}
                        setInputs={setInputs}
                        onChange={handleInputChange}
                    />
                    <label>
                        Combustible
                        <select
                            name="combustible"
                            value={inputs.combustible}
                            onChange={handleInputChange}
                        >
                            <option value="Nafta">Nafta</option>
                            <option value="Diesel">Diesel</option>
                            <option value="GNC">GNC</option>
                        </select>
                    </label>
                    <label>
                        Cilindrada
                        <input
                            type="number"
                            min="0.1"
                            max="20"
                            step="0.1"
                            name="cilindrada"
                            placeholder="litros"
                            value={inputs.cilindrada}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Año
                        <input
                            type="number"
                            min="1900"
                            max="9999"
                            name="year"
                            placeholder="-"
                            value={inputs.year}
                            onChange={handleInputChange}
                        />
                    </label>
                    <Wide>
                        {error === "" ? "VIN" : error}
                        <input
                            type="text"
                            minLength={17}
                            name="vin"
                            placeholder="-"
                            autoComplete="off"
                            value={inputs.vin}
                            onChange={handleInputChange}
                            required
                        />
                    </Wide>
                    <label>
                        {error === "" ? "Patente" : error}
                        <input
                            type="text"
                            name="patente"
                            placeholder="-"
                            autoComplete="off"
                            value={inputs.patente}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <Wide>
                        Propietario
                        <select
                            disabled
                            name="clienteId"
                            value={inputs.clienteId}
                            onChange={handleInputChange}
                        >
                            <option value="">{inputs.clienteId}</option>
                        </select>
                    </Wide>
                </Form>
            </Card>
        </>
    );
};

export default Vehiculo;
