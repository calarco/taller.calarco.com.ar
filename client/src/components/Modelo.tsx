import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    UseFormRegister,
    UseFormWatch,
    UseFormSetValue,
} from "react-hook-form";
import feathersClient from "feathersClient";

import { useCarName } from "Gestion/context/carNameContext";
import Label from "components/Label";

const Container = styled.fieldset`
    height: 100%;
    display: grid;
    grid-auto-flow: column;
    align-items: center;

    label {
        position: relative;

        button {
            position: absolute;
            bottom: calc(0.75rem + 1px);
            right: 1rem;
            padding: 0.25rem 0.5rem;
            border: none;
        }
    }

    input[name="fabricante"],
    input[name="modelo"] {
        display: block;
        appearance: none;
        width: 100%;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: rgba(236, 239, 241, 0.7);
        border: 1px solid rgba(0, 0, 0, 0);
        outline: none;
        font: var(--subhead1);

        &:focus {
            background: var(--primary-variant);
            border: var(--border-primary);
            box-shadow: var(--shadow-variant);
        }

        &:not(:disabled):hover {
            cursor: pointer;
            background: var(--primary-variant);
        }

        &:focus:hover {
            cursor: text;
        }

        &::-webkit-calendar-picker-indicator {
            display: none !important;
        }
    }

    input::placeholder {
        color: var(--on-background);
    }

    input::-webkit-calendar-picker-indicator {
        display: none;
    }
`;

type Inputs = {
    motivo?: string;
    patente?: string;
    year?: string;
    combustible?: string;
    cilindrada?: string;
    vin?: string;
    clienteId?: number;
    km?: string;
    labor?: string;
    email?: string;
    factura?: string;
    fabricanteId: number;
    fabricante: string;
    modeloId: number;
    modelo: string;
};

type ComponentProps = {
    register: UseFormRegister<Inputs>;
    watch: UseFormWatch<Inputs>;
    setValue: UseFormSetValue<Inputs>;
    className?: string;
};

const Modelo = function ({
    register,
    watch,
    setValue,
    className,
}: ComponentProps) {
    const { fabricantes, modelos } = useCarName();

    const watchFabricanteId = watch("fabricanteId");
    const watchFabricante = watch("fabricante");
    const watchModeloId = watch("modeloId");
    const watchModelo = watch("modelo");
    const [fabricante, setFabricante] = useState("");
    const [modelo, setModelo] = useState("");

    const createFabricante = () => {
        feathersClient
            .service("fabricantes")
            .create({
                nombre: watchFabricante,
            })
            .then((data: Fabricante) => {
                setValue("fabricanteId", data.id);
                setFabricante(data.nombre);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    };

    const createModelo = () => {
        feathersClient
            .service("modelos")
            .create({
                nombre: watchModelo,
                fabricanteId: watchFabricanteId,
            })
            .then((data: Modelo) => {
                setValue("modeloId", data.id);
                setModelo(data.nombre);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    };

    useEffect(() => {
        watchFabricanteId === 0 &&
            watchModeloId !== 0 &&
            feathersClient
                .service("modelos")
                .get(watchModeloId)
                .then((modelo: Modelo) => {
                    setValue("fabricanteId", modelo.fabricanteId);
                    setModelo(modelo.nombre);
                    feathersClient
                        .service("fabricantes")
                        .get(modelo.fabricanteId)
                        .then((fabricante: Fabricante) => {
                            setFabricante(fabricante.nombre);
                        })
                        .catch((error: FeathersErrorJSON) => {
                            console.error(error.message);
                        });
                })
                .catch((error: FeathersErrorJSON) => {
                    console.error(error);
                });
    }, [watchFabricanteId, watchModeloId]);

    useEffect(() => {
        setValue("modelo", "");
        setValue("modeloId", 0);
        feathersClient
            .service("fabricantes")
            .find({
                query: {
                    nombre: watchFabricante,
                    $limit: 1,
                },
            })
            .then((found: Fabricantes) => {
                found.data[0] && setValue("fabricanteId", found.data[0].id);
                found.data[0] && setFabricante(found.data[0].nombre);
                setModelo("");
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    }, [watchFabricante]);

    useEffect(() => {
        feathersClient
            .service("modelos")
            .find({
                query: {
                    nombre: watchModelo,
                    $limit: 1,
                },
            })
            .then((found: Modelos) => {
                found.data[0] && setValue("modeloId", found.data[0].id);
                found.data[0] && setModelo(found.data[0].nombre);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error);
            });
    }, [watchModelo]);

    return (
        <Container className={className}>
            <Label
                title="Marca"
                onBlur={() =>
                    watchFabricante === fabricante && setValue("fabricante", "")
                }
            >
                <input
                    list="fabricantes"
                    placeholder={fabricante}
                    autoComplete="off"
                    {...register("fabricante", { required: true })}
                />
                <datalist id="fabricantes">
                    {fabricantes.data.map((aFabricante) => (
                        <option key={aFabricante.id} value={aFabricante.nombre}>
                            {aFabricante.nombre}
                        </option>
                    ))}
                </datalist>
                {watchFabricante !== "" && watchFabricante !== fabricante && (
                    <button type="button" onClick={() => createFabricante()}>
                        Crear
                    </button>
                )}
            </Label>
            <Label
                title="Modelo"
                onBlur={() => watchModelo === modelo && setValue("modelo", "")}
            >
                <input
                    list="modelos"
                    placeholder={modelo}
                    autoComplete="off"
                    disabled={watchFabricanteId === 0 ? true : false}
                    {...register("modelo", { required: true })}
                />
                <datalist id="modelos">
                    {modelos.data.map(
                        (aModelo) =>
                            aModelo.fabricanteId === watchFabricanteId && (
                                <option key={aModelo.id} value={aModelo.nombre}>
                                    {aModelo.nombre}
                                </option>
                            )
                    )}
                </datalist>
                {watchModelo !== "" && watchModelo !== modelo && (
                    <button type="button" onClick={() => createModelo()}>
                        Crear
                    </button>
                )}
            </Label>
        </Container>
    );
};

export default Modelo;
