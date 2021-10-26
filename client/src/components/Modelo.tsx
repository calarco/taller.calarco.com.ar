import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import feathersClient from "feathersClient";

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
    }

    input::placeholder {
        color: var(--on-background);
    }

    input::-webkit-calendar-picker-indicator {
        display: none;
    }
`;

type Inputs = {
    fabricanteId: number;
    fabricante: string;
    modeloId: number;
    modelo: string;
};

type ComponentProps = {
    inputs: Inputs;
    setInputs: (inputs: any) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

const Modelo = function ({
    inputs,
    setInputs,
    onChange,
    className,
}: ComponentProps) {
    const [fabricantes, setFabricantes] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
    const [modelos, setModelos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
                fabricanteId: 0,
            },
        ],
    });
    const [fabricante, setFabricante] = useState("");
    const [modelo, setModelo] = useState("");

    const loadFabricantes = useCallback(() => {
        feathersClient
            .service("fabricantes")
            .find({
                query: {
                    $limit: 100,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found: Fabricantes) => {
                setFabricantes(found);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    }, []);

    const createFabricante = () => {
        feathersClient
            .service("fabricantes")
            .create({
                nombre: inputs.fabricante,
            })
            .then((data: Fabricante) => {
                setInputs((inputs: Inputs) => ({
                    ...inputs,
                    fabricanteId: data.id,
                }));
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
                nombre: inputs.modelo,
                fabricanteId: inputs.fabricanteId,
            })
            .then((data: Modelo) => {
                setInputs((inputs: Inputs) => ({
                    ...inputs,
                    modeloId: data.id,
                }));
                setModelo(data.nombre);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    };

    useEffect(() => {
        loadFabricantes();
        feathersClient
            .service("fabricantes")
            .on("created", () => loadFabricantes());
        feathersClient
            .service("fabricantes")
            .on("patched", () => loadFabricantes());
        feathersClient
            .service("fabricantes")
            .on("removed", () => loadFabricantes());
    }, [loadFabricantes]);

    useEffect(() => {
        inputs.fabricanteId === 0 &&
            inputs.modeloId !== 0 &&
            feathersClient
                .service("modelos")
                .get(inputs.modeloId)
                .then((modelo: Modelo) => {
                    setInputs((inputs: Inputs) => ({
                        ...inputs,
                        fabricanteId: modelo.fabricanteId,
                    }));
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
    }, [inputs.fabricanteId, inputs.modeloId, setInputs]);

    useEffect(() => {
        inputs.fabricanteId !== 0 &&
            feathersClient
                .service("modelos")
                .find({
                    query: {
                        fabricanteId: inputs.fabricanteId,
                        $limit: 200,
                        $sort: {
                            nombre: 1,
                        },
                    },
                })
                .then((found: Modelos) => {
                    setModelos(found);
                })
                .catch((error: FeathersErrorJSON) => {
                    console.error(error.message);
                });
    }, [inputs.fabricanteId, setInputs]);

    useEffect(() => {
        setInputs((inputs: Inputs) => ({
            ...inputs,
            modeloId: 0,
            modelo: "",
        }));
        feathersClient
            .service("fabricantes")
            .find({
                query: {
                    nombre: inputs.fabricante,
                    $limit: 1,
                },
            })
            .then((found: Fabricantes) => {
                found.data[0] &&
                    setInputs((inputs: Inputs) => ({
                        ...inputs,
                        fabricanteId: found.data[0].id,
                    }));
                found.data[0] && setFabricante(found.data[0].nombre);
                setModelo("");
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });
    }, [inputs.fabricante, setInputs]);

    useEffect(() => {
        feathersClient
            .service("modelos")
            .find({
                query: {
                    nombre: inputs.modelo,
                    $limit: 1,
                },
            })
            .then((found: Modelos) => {
                found.data[0] &&
                    setInputs((inputs: Inputs) => ({
                        ...inputs,
                        modeloId: found.data[0].id,
                    }));
                found.data[0] && setModelo(found.data[0].nombre);
            })
            .catch((error: FeathersErrorJSON) => {
                console.error(error);
            });
    }, [inputs.modelo, setInputs]);

    return (
        <Container className={className}>
            <label>
                Marca
                <input
                    name="fabricante"
                    list="fabricantes"
                    placeholder={fabricante}
                    value={inputs.fabricante}
                    onChange={onChange}
                    onBlur={() =>
                        inputs.fabricante === fabricante &&
                        setInputs((inputs: Inputs) => ({
                            ...inputs,
                            fabricante: "",
                        }))
                    }
                    autoComplete="off"
                />
                <datalist id="fabricantes">
                    {fabricantes.data.map((aFabricante) => (
                        <option key={aFabricante.id} value={aFabricante.nombre}>
                            {aFabricante.nombre}
                        </option>
                    ))}
                </datalist>
                {inputs.fabricante !== "" && inputs.fabricante !== fabricante && (
                    <button type="button" onClick={() => createFabricante()}>
                        Crear
                    </button>
                )}
            </label>
            <label>
                Modelo
                <input
                    name="modelo"
                    list="modelos"
                    placeholder={modelo}
                    value={inputs.modelo}
                    onChange={onChange}
                    onBlur={() =>
                        inputs.modelo === modelo &&
                        setInputs((inputs: Inputs) => ({
                            ...inputs,
                            modelo: "",
                        }))
                    }
                    autoComplete="off"
                    disabled={inputs.fabricanteId === 0 ? true : false}
                />
                <datalist id="modelos">
                    {modelos.data.map((aModelo) => (
                        <option key={aModelo.id} value={aModelo.nombre}>
                            {aModelo.nombre}
                        </option>
                    ))}
                </datalist>
                {inputs.modelo !== "" && inputs.modelo !== modelo && (
                    <button type="button" onClick={() => createModelo()}>
                        Crear
                    </button>
                )}
            </label>
        </Container>
    );
};

export default Modelo;
