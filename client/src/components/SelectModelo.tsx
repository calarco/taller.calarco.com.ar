import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
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
    background: var(--surface);
    display: grid;
    grid-auto-flow: column;
    align-items: center;

    label {
        position: relative;
    }
`;

type Props = {
    selected?: boolean;
};

const Input = styled.input<Props>`
    ${(props) =>
        props.selected &&
        css`
            &::placeholder {
                color: var(--on-background);
            }
        `};
`;

const Button = transition.button.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    position: absolute;
    bottom: calc(0.75rem + 1px);
    right: 1rem;
    padding: 0.25rem 0.5rem;
    border: none;

    &:enter {
        opacity: 0;
        transform: translateX(1rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transform: translateX(1rem);
        transition: 0.15s ease-in;
    }
`;

type ComponentProps = {
    register: UseFormRegister<Inputs>;
    watch: UseFormWatch<Inputs>;
    setValue: UseFormSetValue<Inputs>;
    error?: boolean;
    className?: string;
};

const SelectModelo = function ({
    register,
    watch,
    setValue,
    error,
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
        watchFabricanteId &&
            watchFabricanteId !== 0 &&
            watchFabricanteId !==
                modelos.data.find(({ id }) => id === watchModeloId)
                    ?.fabricanteId &&
            setValue("modeloId", 0);
    }, [watchFabricanteId, watchModeloId, modelos.data, setValue]);

    useEffect(() => {
        try {
            setModelo(
                modelos.data.find(({ id }) => id === watchModeloId)!.nombre
            );
            setValue(
                "fabricanteId",
                modelos.data.find(({ id }) => id === watchModeloId)!
                    .fabricanteId
            );
        } catch {
            setModelo("");
        }
    }, [watchModeloId, modelos.data, setValue]);

    useEffect(() => {
        try {
            setValue(
                "modeloId",
                modelos.data.find(({ nombre }) => nombre === watchModelo)!.id
            );
        } catch {}
    }, [watchModelo, modelos.data, setValue]);

    useEffect(() => {
        try {
            setFabricante(
                fabricantes.data.find(({ id }) => id === watchFabricanteId)!
                    .nombre
            );
        } catch {
            setFabricante("");
        }
    }, [watchFabricanteId, fabricantes.data]);

    useEffect(() => {
        try {
            setValue(
                "fabricanteId",
                fabricantes.data.find(
                    ({ nombre }) => nombre === watchFabricante
                )!.id
            );
        } catch {}
    }, [watchFabricante, fabricantes.data, setValue]);

    return (
        <Container className={className}>
            <input type="hidden" {...register("fabricanteId")} />
            <input
                type="hidden"
                {...register("modeloId", {
                    validate: (modeloId) => (modeloId === 0 ? false : true),
                })}
            />
            <Label
                title="Marca"
                error={
                    watchFabricanteId === 0 && error
                        ? "Seleccione una marca"
                        : undefined
                }
                onBlur={() =>
                    watchFabricante === fabricante && setValue("fabricante", "")
                }
            >
                <Input
                    list="fabricantes"
                    selected={fabricante !== "" ? true : false}
                    placeholder={fabricante || "-"}
                    autoComplete="off"
                    {...register("fabricante")}
                />
                <datalist id="fabricantes">
                    {fabricantes.data.map((aFabricante) => (
                        <option key={aFabricante.id} value={aFabricante.nombre}>
                            {aFabricante.nombre}
                        </option>
                    ))}
                </datalist>
                <Button
                    in={
                        watchFabricante !== "" && watchFabricante !== fabricante
                    }
                    type="button"
                    onClick={() => createFabricante()}
                >
                    Crear
                </Button>
            </Label>
            <Label
                title="Modelo"
                error={
                    watchFabricanteId !== 0 && error
                        ? "Seleccione un modelo"
                        : undefined
                }
                onBlur={() => watchModelo === modelo && setValue("modelo", "")}
            >
                <Input
                    list="modelos"
                    selected={modelo !== "" ? true : false}
                    placeholder={modelo || "-"}
                    autoComplete="off"
                    disabled={watchFabricanteId === 0 ? true : false}
                    {...register("modelo")}
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
                <Button
                    in={watchModelo !== "" && watchModelo !== modelo}
                    type="button"
                    onClick={() => createModelo()}
                >
                    Crear
                </Button>
            </Label>
        </Container>
    );
};

export default SelectModelo;
