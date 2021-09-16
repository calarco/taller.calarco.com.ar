import React, { useEffect, useState } from "react";
import feathersClient from "feathersClient";

import Form from "components/Form";
import Modelo from "components/Modelo";

const Actions = function ({ turno, edit, unEdit }) {
    const [inputs, setInputs] = useState({
        fecha: "",
        motivo: "",
        fabricanteId: 0,
        fabricante: "",
        modeloId: 0,
        modelo: "",
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
                .service("turnos")
                .create({
                    fecha: inputs.fecha,
                    motivo: inputs.motivo,
                    modeloId: inputs.modeloId,
                })
                .then(() => {})
                .catch((error) => {
                    console.error(error);
                });
    };

    const handleEdit = (event) => {
        event.preventDefault();
        validate(inputs) === "" &&
            feathersClient
                .service("turnos")
                .patch(turno.id, {
                    fecha: inputs.fecha,
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

    useEffect(() => {
        setInputs({
            fecha: turno.fecha,
            motivo: turno.motivo,
            fabricanteId: 0,
            fabricante: "",
            modeloId: turno.modeloId,
            modelo: "",
        });
    }, [turno]);

    return (
        <Form
            edit={edit}
            unEdit={unEdit}
            onSubmit={turno.id === 0 ? handleCreate : handleEdit}
        >
            <label>
                Motivo
                <input
                    type="text"
                    name="motivo"
                    placeholder="-"
                    autoComplete="off"
                    value={inputs.motivo}
                    onChange={handleInputChange}
                />
            </label>
            <Modelo
                inputs={inputs}
                setInputs={setInputs}
                onChange={handleInputChange}
            />
        </Form>
    );
};

export default Actions;
