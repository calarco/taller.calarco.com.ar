import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

type ActiveProps = {
    readonly active?: boolean;
    readonly new?: boolean;
};

const Form = styled.form<ActiveProps>`
    width: 100%;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(0, 0, 0, 0);
    transition: 0.25s ease-in;

    label {
        height: 100%;
        background: var(--surface);
    }

    article {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 2px;
        align-items: start;
        transition: 0.25s ease-in;
        overflow: hidden;
    }

    ${(props) =>
        props.new &&
        css`
            position: sticky;
            top: 0;

            article {
                max-height: 0;
            }
        `};

    ${(props) =>
        props.active &&
        css`
            background: var(--primary);
            gap: 2px;
            transition: 0.3s ease-out;

            article {
                max-height: 25rem;
                transition: 0.3s ease-out;
            }
        `};
`;

const Box = styled.article`
    padding: 8px 12px;
    background: var(--surface);
`;

const Buttons = styled.div<ActiveProps>`
    width: 100%;
    max-height: 0;
    overflow: hidden;
    text-align: center;
    display: flex;
    gap: 2px;

    button {
        width: 100%;
        background: var(--surface);
        transition: 0.25s ease-in;
    }

    ${(props) =>
        props.new &&
        css`
            max-height: 5rem;
            padding-top: 2px;
        `};

    ${(props) =>
        props.active &&
        css`
            max-height: 5rem;
            padding-top: 2px;
            transition: 0.3s ease-out;
        `};
`;

const Text = styled.label`
    grid-column-end: span 2;
`;

const Number = styled.label`
    grid-column-start: 3;
    text-align: right;

    h4 {
        padding: 4px 24px;
    }
`;

const Numbers = styled.div`
    grid-column-start: 3;
    display: grid;
    grid-template-columns: auto 10rem;

    h5,
    p {
        display: inline;
    }
    h4,
    h6 {
        display: inline;
        text-align: right;
    }
`;

const Reparacion = function ({ reparacion, lastkm, selected, setSelected }) {
    const [inputs, setInputs] = useState({
        fecha: "",
        reparacion: "",
        repuestos: "",
        labor: "",
        costo: "",
        km: "",
    });
    const [labels, setLabels] = useState({ reparacion: "Reparación" });

    useEffect(() => {
        setInputs({
            fecha: new Date().toISOString().substring(0, 10),
            reparacion: "",
            repuestos: "",
            labor: "",
            costo: "",
            km: lastkm,
        });
    }, [lastkm]);

    useEffect(() => {
        reparacion.id !== "0" &&
            setInputs({
                fecha: reparacion.createdAt.substring(0, 10),
                reparacion: reparacion.reparacion,
                repuestos: reparacion.repuestos,
                labor: reparacion.labor,
                costo: reparacion.costo,
                km: reparacion.km,
            });
    }, [reparacion]);

    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLabels(validate(inputs));
    };

    function validate(inputs) {
        let errores = { reparacion: "Reparacion" };
        if (!inputs.reparacion) {
            errores.reparacion = "Ingrese la reparación";
        }
        return errores;
    }

    return (
        <Form
            onSubmit={handleSubmit}
            noValidate
            active={selected.reparacionId === reparacion.id ? true : false}
            new={reparacion.id === "0" ? true : false}
        >
            {selected.reparacionId === reparacion.id &&
            selected.form === "reparacion" ? (
                <article>
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
                    <label>
                        KM
                        <input
                            type="number"
                            min="0000000"
                            max="9999999"
                            name="km"
                            placeholder="0"
                            value={inputs.km || ""}
                            onChange={handleInputChange}
                        />
                    </label>
                    <Number>
                        Total
                        <h4>
                            $
                            {(parseInt(inputs.costo, 10) || 0) +
                                (parseInt(inputs.labor, 10) || 0)}
                        </h4>
                    </Number>
                    <Text>
                        {labels.reparacion}
                        <input
                            type="text"
                            name="reparacion"
                            placeholder="-"
                            value={inputs.reparacion || ""}
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
                            value={inputs.labor || ""}
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
                            value={inputs.costo || ""}
                            onChange={handleInputChange}
                        />
                    </Number>
                </article>
            ) : reparacion.id !== "0" ? (
                <Box
                    onClick={() => {
                        setSelected({
                            clienteId: selected.clienteId,
                            vehiculoId: selected.vehiculoId,
                            reparacionId: reparacion.id,
                            form: "",
                        });
                    }}
                >
                    <h5>
                        {reparacion.createdAt &&
                            Intl.DateTimeFormat("default", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date(reparacion.createdAt))}
                        <p> {reparacion.km} km</p>
                    </h5>
                    <Numbers>
                        <h4>
                            $
                            {parseInt(reparacion.costo, 10) +
                                parseInt(reparacion.labor, 10)}
                        </h4>
                        <h5>Total</h5>
                    </Numbers>
                    <h4>{reparacion.reparacion}</h4>
                    <Numbers>
                        <h6>${reparacion.labor}</h6>
                        <p>Mano de obra</p>
                    </Numbers>
                    <p>{reparacion.repuestos}</p>
                    <Numbers>
                        <h6>${reparacion.costo}</h6>
                        <p>Repuestos</p>
                    </Numbers>
                </Box>
            ) : undefined}
            <Buttons
                active={selected.reparacionId === reparacion.id}
                new={reparacion.id === "0" ? true : false}
            >
                {reparacion.id === "0" ? (
                    <button
                        onClick={() =>
                            setSelected({
                                clienteId: selected.clienteId,
                                vehiculoId: selected.vehiculoId,
                                reparacionId: "0",
                                form: "reparacion",
                            })
                        }
                    >
                        Agregar Reparación
                    </button>
                ) : selected.reparacionId === reparacion.id &&
                  selected.form === "reparacion" ? (
                    <>
                        <button
                            onClick={() => {
                                setSelected({
                                    clienteId: selected.clienteId,
                                    vehiculoId: selected.vehiculoId,
                                    reparacionId: 0,
                                    form: "",
                                });
                            }}
                        >
                            Cancelar
                        </button>
                        <button type="submit" onClick={() => {}}>
                            Guardar
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => {}}>Borrar</button>
                        <button
                            onClick={() =>
                                setSelected({
                                    clienteId: selected.clienteId,
                                    vehiculoId: selected.vehiculoId,
                                    reparacionId: reparacion.id,
                                    form: "reparacion",
                                })
                            }
                        >
                            Editar
                        </button>
                    </>
                )}
            </Buttons>
        </Form>
    );
};

export default Reparacion;
