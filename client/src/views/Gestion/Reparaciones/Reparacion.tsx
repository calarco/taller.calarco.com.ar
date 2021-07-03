import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import Card from "components/Card";

type Props = {
    readonly error?: boolean;
};

const Box = styled.article`
    padding: 1.5rem 2rem;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
`;

const Form = styled.aside`
    grid-template-columns: auto 1fr auto;
`;

const Label = styled.label<Props>`
    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error);
        `};
`;

const Text = styled.label<Props>`
    grid-column-end: span 2;

    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error);
        `};
`;

const Number = styled.label`
    grid-column-start: 3;
    text-align: right;
`;

const Numbers = styled.div`
    text-align: right;
`;

const Reparacion = function ({
    setActiveId,
    reparacion,
    active,
    activeSection,
    setActiveSection,
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
    const [message, setMessage] = useState("");

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
                .then((data) => {
                    setActiveId(data.id);
                    setMessage("Reparacion creada");
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
                .then(() => {
                    setMessage("Reparacion guardada");
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
        <Card
            type="Reparación"
            message={message}
            active={active}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            create={reparacion.id === 0 ? true : false}
            onSubmit={reparacion.id === 0 ? handleCreate : handleEdit}
            onReset={handleDelete}
        >
            {reparacion.id !== 0 && (
                <Box
                    onClick={() => {
                        setActiveId(reparacion.id);
                    }}
                >
                    <h5>
                        {reparacion.createdAt &&
                            Intl.DateTimeFormat("default", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date(reparacion.createdAt))}
                        <small>{reparacion.km} km</small>
                    </h5>
                    <Numbers>Total</Numbers>
                    <h4>
                        $
                        {parseInt(reparacion.costo, 10) +
                            parseInt(reparacion.labor, 10)}
                    </h4>
                    <div>
                        <h4>{reparacion.reparacion}</h4>
                    </div>
                    <Numbers>
                        <h6>${reparacion.labor}</h6>
                    </Numbers>
                    <label>Mano de obra</label>
                    <p>{reparacion.repuestos}</p>
                    <Numbers>
                        <h6>${reparacion.costo}</h6>
                    </Numbers>
                    <label>Repuestos</label>
                </Box>
            )}
            <Form>
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
            </Form>
        </Card>
    );
};

export default Reparacion;
