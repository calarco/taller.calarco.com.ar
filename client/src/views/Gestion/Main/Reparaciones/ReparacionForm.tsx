import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import Form from "components/Form";

type Props = {
    readonly create?: boolean;
    readonly active?: boolean;
    readonly edit?: boolean;
    readonly error?: boolean;
};

const Container = styled(Form)`
    grid-template-columns: auto 1fr auto;
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

const Buttons = styled.div<Props>`
    grid-row: 4;
    grid-column-start: 1;
    grid-column-end: span 3;
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

const ReparacionForm = function ({
    reparacion,
    edit,
    unEdit,
    remove,
    unRemove,
}) {
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
                    km: inputs.km,
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
                    km: inputs.km,
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
            km: reparacion.id === 0 ? "" : reparacion.km,
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
            <Container
                create={reparacion.id === 0 ? true : false}
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
                        required
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
            </Container>
            {reparacion.id !== 0 && (
                <Remove active={remove}>
                    <h5>¿Borrar vehiculo?</h5>
                    <Buttons>
                        <button type="button" onClick={unRemove}>
                            Cancelar
                        </button>
                        <button type="reset" onClick={handleDelete}>
                            Borrar
                        </button>
                    </Buttons>
                </Remove>
            )}
        </>
    );
};

export default ReparacionForm;
