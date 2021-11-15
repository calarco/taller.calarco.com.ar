import React, { MouseEvent, ChangeEvent, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import feathersClient from "feathersClient";
import styled from "styled-components";
import transition from "styled-transition-group";
import { TransitionGroup } from "react-transition-group";
import { renderEmail, Email } from "react-html-email";

import FormComponent from "components/Form";
import Label from "components/Label";
import ModeloComponent from "components/Modelo";
import Mensaje from "Gestion/sections/Presupuesto/Mensaje";

const Container = styled(FormComponent)`
    grid-template-columns: 3fr 4fr 3fr 3fr [end];

    label:nth-child(4) {
        grid-column-end: span 2;
    }

    input[name="labor"],
    input[name="cantidad"],
    input[name="precio"] {
        text-align: right;
    }
`;

const Modelo = styled(ModeloComponent)`
    grid-column-end: span 2;
`;

const Repuestos = styled.div`
    grid-column-end: span 4;
    min-height: 5.25rem;
    padding: 0.5rem 1rem 0.75rem 1rem;
    background: var(--surface);
    display: grid;
    align-content: space-between;
    gap: 0.25rem;
    font: var(--label);
    color: var(--on-background-variant);

    ul {
        margin: 0;
        padding: 0;
        border-radius: 4px;
        outline: var(--border-variant);

        li {
            height: 2.5rem;
            display: grid;
            grid-template-columns: 5rem 1fr 8rem 8rem;
            align-items: center;

            &:first-child {
                border-radius: 4px;
                background: rgba(236, 239, 241, 0.7);

                &:focus-within {
                    box-shadow: var(--shadow-variant);
                }
            }

            input {
                position: relative;
                height: 100%;
                border-radius: 0;
                outline: 1px solid rgba(0, 0, 0, 0);

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
                height: 100%;
                padding: 0;
                border-radius: 0 4px 4px 0;

                &::after {
                    content: "";
                    position: absolute;
                    top: calc(50% - 0.75rem);
                    left: 0;
                    height: 1.5rem;
                    border-left: 1px solid var(--primary-variant);
                }
            }
        }
    }
`;

const Repuesto = transition.li`
    height: 2.5rem;
    display: grid;
    grid-template-columns: 5rem 1fr 8rem 8rem;
    align-items: center;

    p {
        position: relative;
        padding: 0.25rem 1rem;

        &:nth-child(3),
        &:first-child {
            text-align: right;
            font: 400 0.9rem/1.25rem var(--font-family-alt);
        }
    }

    button {
        height: 100%;
        padding: 0;
        border-radius: 0 4px 4px 0;

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 0.75rem);
            left: 0;
            height: 1.5rem;
            border-left: 1px solid var(--primary-variant);
        }
    }

    &:enter {
        opacity: 0;
        max-height: 0;
    }

    &:enter-active {
        opacity: 1;
        max-height: 3rem;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
        max-height: 3rem;
    }

    &:exit-active {
        opacity: 0;
        max-height: 0;
        transition: 0.15s ease-in;
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
    grid-template-columns: 2fr 3fr 2fr;
    align-items: center;
    gap: 0.5rem;
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
`;

type Inputs = {
    patente: string;
    km: string;
    motivo: string;
    labor: string;
    email: string;
    factura: string;
    fabricanteId: number;
    fabricante: string;
    modeloId: number;
    modelo: string;
};

type ComponentProps = {
    edit: boolean;
    unEdit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Form = function ({ edit, unEdit }: ComponentProps) {
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>();

    const [inputs, setInputs] = useState({
        cantidad: "1",
        repuesto: "",
        precio: "",
    });
    const [repuestos, setRepuestos] = useState([
        {
            cantidad: "1",
            repuesto: "",
            precio: "",
        },
    ]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    const capitalize = (text: string) => {
        return text
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
    };

    const onSubmit: SubmitHandler<Inputs> = (data) =>
        feathersClient
            .service("presupuestos")
            .create({
                patente: data.patente.toUpperCase(),
                km: data.km,
                motivo: capitalize(data.motivo),
                labor: data.labor,
                repuestos: repuestos,
                modeloId: data.modeloId,
            })
            .then((created: Presupuesto) => {
                data.email !== "" &&
                    feathersClient
                        .service("mailer")
                        .create({
                            to: data.email,
                            subject:
                                "Servicio Especializado Gabriel Mezzanotte | Facturar a: " +
                                data.factura,
                            html: renderEmail(
                                <Email title="Presupuesto">
                                    <Mensaje
                                        user={"montiel"}
                                        factura={"mezannotte"}
                                        presupuesto={created}
                                    />
                                </Email>
                            ),
                        })
                        .then(() => {})
                        .catch((error: FeathersErrorJSON) => {
                            console.error(error.message);
                        });
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error);
            });

    const removeRepuesto = (index: number) => {
        const newRepuestos = [...repuestos];
        newRepuestos.splice(index, 1);
        setRepuestos(newRepuestos);
    };

    return (
        <Container
            edit={edit}
            unEdit={unEdit}
            onSubmit={handleSubmit(onSubmit)}
            noButtons
        >
            <Modelo register={register} watch={watch} setValue={setValue} />
            <Label
                title="Patente"
                error={errors.patente && "Ingrese la patente"}
            >
                <input
                    type="text"
                    defaultValue=""
                    placeholder="-"
                    autoComplete="off"
                    {...register("patente", { required: true, maxLength: 9 })}
                />
            </Label>
            <label>
                KM
                <input
                    type="number"
                    placeholder="-"
                    autoComplete="off"
                    {...(register("km"), { max: 9999999 })}
                />
            </label>
            <label>
                Reparacion
                <input
                    type="text"
                    defaultValue=""
                    placeholder="-"
                    autoComplete="off"
                    {...register("motivo", { required: true })}
                />
            </label>
            <label>
                Mano de obra
                <input
                    type="number"
                    placeholder="0"
                    autoComplete="off"
                    {...(register("labor"), { max: 9999999 })}
                />
            </label>
            <label>
                Facturar a
                <input
                    type="text"
                    defaultValue=""
                    placeholder="-"
                    autoComplete="off"
                    {...register("factura")}
                />
            </label>
            <Repuestos>
                Repuestos
                <ul>
                    <li>
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
                        <button
                            type="button"
                            onClick={() => {
                                setRepuestos((repuestos) => [
                                    ...repuestos,
                                    {
                                        cantidad: inputs.cantidad,
                                        repuesto: capitalize(inputs.repuesto),
                                        precio: inputs.precio,
                                    },
                                ]);
                                setInputs((inputs) => ({
                                    ...inputs,
                                    cantidad: "1",
                                    repuesto: "",
                                    precio: "0",
                                }));
                            }}
                        >
                            Agregar
                        </button>
                    </li>
                    <TransitionGroup component={null}>
                        {repuestos[1] &&
                            repuestos.map(
                                (aRepuesto, index) =>
                                    index !== 0 && (
                                        <Repuesto
                                            key={index}
                                            unmountOnExit
                                            timeout={{
                                                enter: 200,
                                                exit: 150,
                                            }}
                                        >
                                            <p>{aRepuesto.cantidad}</p>
                                            <p>{aRepuesto.repuesto}</p>
                                            <p>${aRepuesto.precio}</p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRepuesto(index)
                                                }
                                            >
                                                Borrar
                                            </button>
                                        </Repuesto>
                                    )
                            )}
                    </TransitionGroup>
                </ul>
            </Repuestos>
            <Buttons>
                <button type="button" onClick={unEdit}>
                    Cancelar
                </button>
                <input
                    type="email"
                    placeholder="Direccion de correo"
                    {...register("email")}
                />
                <button type="submit">Enviar</button>
            </Buttons>
        </Container>
    );
};

export default Form;
