import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import feathersClient from "feathersClient";

const Container = styled.fieldset`
    grid-column-end: span 2;
    grid-row-end: span 2;
    height: 100%;
    display: grid;
    align-items: center;

    label {
        position: relative;
        height: 100%;

        button {
            position: absolute;
            bottom: 0;
            right: 1rem;
            margin: 0.5rem 0rem;
            padding: 0.25rem 0.5rem;
            border: none;
        }
    }

    input[name="fabricante"],
    input[name="modelo"] {
        display: block;
        appearance: none;
        width: 100%;
        margin: 0.5rem 0rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: var(--surface-variant);
        border: none;
        outline: none;
        font: var(--subhead1);

        &:hover {
            cursor: pointer;
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

const Modelo = function ({ inputs, setInputs, onChange }) {
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
            .then((found) => {
                setFabricantes(found);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const createFabricante = () => {
        feathersClient
            .service("fabricantes")
            .create({
                nombre: inputs.fabricante,
            })
            .then((data) => {
                setInputs((inputs) => ({
                    ...inputs,
                    fabricanteId: data.id,
                }));
                setFabricante(data.nombre);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const createModelo = () => {
        feathersClient
            .service("modelos")
            .create({
                nombre: inputs.modelo,
                fabricanteId: inputs.fabricanteId,
            })
            .then((data) => {
                setInputs((inputs) => ({
                    ...inputs,
                    modeloId: data.id,
                }));
                setModelo(data.nombre);
            })
            .catch((error) => {
                console.error(error);
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
                .then((modelo) => {
                    setInputs((inputs) => ({
                        ...inputs,
                        fabricanteId: modelo.fabricanteId,
                    }));
                    setModelo(modelo.nombre);
                    feathersClient
                        .service("fabricantes")
                        .get(modelo.fabricanteId)
                        .then((fabricante) => {
                            setFabricante(fabricante.nombre);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
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
                .then((found) => {
                    setModelos(found);
                })
                .catch((error) => {
                    console.error(error);
                });
    }, [inputs.fabricanteId, setInputs]);

    useEffect(() => {
        setInputs((inputs) => ({
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
            .then((found) => {
                found.data[0] &&
                    setInputs((inputs) => ({
                        ...inputs,
                        fabricanteId: found.data[0].id,
                    }));
                found.data[0] && setFabricante(found.data[0].nombre);
                setModelo("");
            })
            .catch((error) => {
                console.error(error);
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
            .then((found) => {
                found.data[0] &&
                    setInputs((inputs) => ({
                        ...inputs,
                        modeloId: found.data[0].id,
                    }));
                found.data[0] && setModelo(found.data[0].nombre);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [inputs.modelo, setInputs]);

    return (
        <Container>
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
                        setInputs((inputs) => ({
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
                        setInputs((inputs) => ({
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
