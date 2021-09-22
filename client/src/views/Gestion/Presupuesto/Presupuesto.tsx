import React, { useState } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";

import FormComponent from "components/Form";
import Modelo from "components/Modelo";

const Container = styled(FormComponent)`
    grid-template-columns: 2fr 4fr 2fr [end];

    label:nth-child(4) {
        grid-column-end: span 2;
    }

    input[name="labor"],
    input[name="cantidad"],
    input[name="precio"] {
        text-align: right;
    }
`;

const Repuestos = styled.label`
    grid-column-end: span 3;

    div {
        border-radius: 4px;
        background: rgba(236, 239, 241, 0.7);
        display: grid;
        grid-template-columns: 2fr 9fr 3fr 4fr;

        input {
            position: relative;
            border-radius: 0;
            border: 1px solid rgba(0, 0, 0, 0);

            &:first-child {
                border-radius: 4px 0 0 4px;
            }

            &:not(:first-child)::after {
                content: "";
                position: absolute;
                top: calc(50% - 1rem);
                left: 0;
                height: 2rem;
                border-left: var(--border-variant);
            }
        }

        button {
            padding: 0;
            border-radius: 0 4px 4px 0;
            border: 1px solid rgba(0, 0, 0, 0);

            &::after {
                content: "";
                position: absolute;
                top: calc(50% - 1rem);
                left: 0;
                height: 2rem;
                border-left: 1px solid var(--primary-variant);
            }
        }
    }
`;

const Buttons = styled.div`
    grid-column-start: 1;
    grid-column-end: span end;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    background: var(--surface);
    display: grid;
    grid-template-columns: 1fr 1fr 2fr 1fr;
    align-items: center;
    gap: 1rem;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        margin: 0;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;
        border: none;

        &:first-child::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            right: 0;
            height: 2rem;
            border-right: 1px solid var(--primary-variant);
        }
    }

    div {
    }

    input {
    }
`;

const Presupuesto = function ({ edit, unEdit }) {
    const [inputs, setInputs] = useState({
        patente: "",
        km: "",
        motivo: "",
        labor: "",
        fabricanteId: 0,
        fabricante: "",
        modeloId: 0,
        modelo: "",
        cantidad: 1,
        repuesto: "",
        precio: "",
        email: "",
    });

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
            : inputs.motivo === ""
            ? (error = "Ingrese el motivo")
            : (error = "");
        return error;
    }

    const handleCreate = (event) => {
        event.preventDefault();
        validate(inputs) === "" &&
            feathersClient
                .service("presupuestos")
                .create({
                    motivo: inputs.motivo,
                    modeloId: inputs.modeloId,
                })
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
                event.target.name === "motivo"
                    ? capitalize(event.target.value)
                    : event.target.value,
        }));
    };

    return (
        <Container
            edit={edit}
            unEdit={unEdit}
            onSubmit={handleCreate}
            noButtons
        >
            <label>
                Patente
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
            <Modelo
                inputs={inputs}
                setInputs={setInputs}
                onChange={handleInputChange}
            />
            <label>
                KM
                <input
                    type="number"
                    min="0000000"
                    max="9999999"
                    name="km"
                    placeholder={"-"}
                    value={inputs.km}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Reparacion
                <input
                    type="text"
                    name="motivo"
                    placeholder="-"
                    autoComplete="off"
                    value={inputs.motivo}
                    onChange={handleInputChange}
                />
            </label>
            <label>
                Mano de obra
                <input
                    type="number"
                    min="0000000"
                    max="9999999"
                    name="labor"
                    placeholder="$0"
                    value={inputs.labor}
                    onChange={handleInputChange}
                />
            </label>
            <Repuestos>
                Repuestos
                <div>
                    <input
                        type="number"
                        min="0000001"
                        max="9999999"
                        name="cantidad"
                        placeholder="Cantidad"
                        value={inputs.cantidad}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="repuesto"
                        placeholder="Repuesto"
                        value={inputs.repuesto}
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                    <input
                        type="number"
                        min="0000000"
                        max="9999999"
                        name="precio"
                        placeholder="Precio"
                        value={inputs.precio}
                        onChange={handleInputChange}
                    />
                    <button>Agregar</button>
                </div>
            </Repuestos>
            <Buttons>
                <button type="button" onClick={unEdit}>
                    Cancelar
                </button>
                <div>Total $0</div>
                <input
                    type="email"
                    name="email"
                    placeholder="Direccion de correo"
                    value={inputs.email || ""}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit" onClick={() => {}}>
                    Enviar
                </button>
            </Buttons>
        </Container>
    );
};

export default Presupuesto;
