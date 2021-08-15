import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import FormComponent from "components/Form";
import Remove from "components/Remove";

type Props = {
    readonly error?: boolean;
};

const Form = styled(FormComponent)`
    grid-template-columns: auto 1fr auto [end];
`;

const Label = styled.label<Props>`
    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error-variant);
        `};
`;

const Text = styled.label<Props>`
    grid-column-end: span 2;

    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error-variant);
        `};
`;

const Number = styled.label`
    grid-column-start: 3;
    text-align: right;
`;

const Actions = function ({ reparacion, edit, unEdit, remove, unRemove }) {
    const [inputs, setInputs] = useState({
        fecha: "",
        km: "",
        reparacion: "",
        repuestos: "",
        labor: "",
        costo: "",
        vehiculoId: 0,
    });
    const [errors, setErrors] = useState({ km: "", reparacion: "" });

    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.substring(1);
    };

    const validate = (inputs) => {
        inputs.km === ""
            ? setErrors((errors) => ({
                  ...errors,
                  km: "Ingrese el kilometraje",
              }))
            : setErrors((errors) => ({
                  ...errors,
                  km: "",
              }));
        inputs.reparacion === ""
            ? setErrors((errors) => ({
                  ...errors,
                  reparacion: "Ingrese la reparación",
              }))
            : setErrors((errors) => ({
                  ...errors,
                  reparacion: "",
              }));
    };

    const handleCreate = (event) => {
        event.preventDefault();
        validate(inputs);
        errors.km === "" &&
            errors.reparacion === "" &&
            feathersClient
                .service("reparaciones")
                .create({
                    km: parseInt(inputs.km),
                    reparacion: inputs.reparacion,
                    repuestos: inputs.repuestos,
                    costo: inputs.costo,
                    labor: inputs.labor,
                    createdAt: new Date(inputs.fecha).toISOString(),
                    updatedAt: new Date().toISOString(),
                    vehiculoId: inputs.vehiculoId,
                })
                .then(() => {})
                .catch((error) => {
                    console.error(error);
                });
    };

    const handleEdit = (event) => {
        event.preventDefault();
        validate(inputs);
        errors.km === "" &&
            errors.reparacion === "" &&
            feathersClient
                .service("reparaciones")
                .patch(reparacion.id, {
                    km: parseInt(inputs.km),
                    reparacion: inputs.reparacion,
                    repuestos: inputs.repuestos,
                    costo: inputs.costo,
                    labor: inputs.labor,
                    createdAt: new Date(inputs.fecha).toISOString(),
                })
                .then(() => {})
                .catch((error) => {
                    console.error(error);
                });
    };

    const handleDelete = (event) => {
        event.preventDefault();
        feathersClient
            .service("reparaciones")
            .remove(reparacion.id)
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
                event.target.name === "reparacion" || "repuestos"
                    ? capitalize(event.target.value)
                    : event.target.value,
        }));
    };

    useEffect(() => {
        setInputs({
            fecha: reparacion.createdAt.substring(0, 10),
            km: reparacion.km,
            reparacion: reparacion.reparacion,
            repuestos: reparacion.repuestos,
            labor: reparacion.labor,
            costo: reparacion.costo,
            vehiculoId: reparacion.vehiculoId,
        });
        setErrors({ km: "", reparacion: "" });
    }, [reparacion]);

    return (
        <>
            <Form
                edit={edit}
                unEdit={unEdit}
                onSubmit={reparacion.id === 0 ? handleCreate : handleEdit}
            >
                <label>
                    Fecha
                    <input
                        type="date"
                        name="fecha"
                        placeholder="-"
                        value={inputs.fecha}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <Label error={errors.km === "" ? false : true}>
                    {errors.km === "" ? "KM" : errors.km}
                    <input
                        type="number"
                        min="0000000"
                        max="9999999"
                        name="km"
                        placeholder={reparacion.km}
                        value={inputs.km}
                        onChange={handleInputChange}
                    />
                </Label>
                <Number>
                    Total
                    <h4>
                        $
                        {(parseInt(inputs.costo, 10) || 0) +
                            (parseInt(inputs.labor, 10) || 0)}
                    </h4>
                </Number>
                <Text error={errors.reparacion === "" ? false : true}>
                    {errors.reparacion === ""
                        ? "Reparación"
                        : errors.reparacion}
                    <input
                        type="text"
                        name="reparacion"
                        placeholder="-"
                        value={inputs.reparacion}
                        onChange={handleInputChange}
                        autoComplete="off"
                        required
                    />
                </Text>
                <Number>
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
                </Number>
                <Text>
                    Repuestos
                    <input
                        type="text"
                        name="repuestos"
                        placeholder="-"
                        value={inputs.repuestos}
                        onChange={handleInputChange}
                        autoComplete="off"
                    />
                </Text>
                <Number>
                    Repuestos
                    <input
                        type="number"
                        min="0000000"
                        max="9999999"
                        name="costo"
                        placeholder="$0"
                        value={inputs.costo}
                        onChange={handleInputChange}
                    />
                </Number>
            </Form>
            {reparacion.id !== 0 && (
                <Remove
                    remove={remove}
                    unRemove={unRemove}
                    handleDelete={handleDelete}
                >
                    ¿Borrar reparación?
                </Remove>
            )}
        </>
    );
};

export default Actions;
