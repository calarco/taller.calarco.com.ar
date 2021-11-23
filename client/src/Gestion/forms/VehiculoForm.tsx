import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import feathersClient from "feathersClient";
import styled from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import FormComponent from "components/Form";
import Label from "components/Label";
import ModeloComponent from "components/SelectModelo";

const Form = styled(FormComponent)`
    grid-template-columns: 1fr 1fr 1fr [end];
`;

const SelectModelo = styled(ModeloComponent)`
    grid-column-end: span 2;
    grid-row-end: span 2;
    grid-auto-flow: row;
`;

type CurrentInputs = Inputs & {
    patente: string;
    vin: string;
};

type ComponentProps = {
    vehiculo?: Vehiculo;
    isActive: boolean;
};

const VehiculoForm = function ({ vehiculo, isActive }: ComponentProps) {
    const { clienteId } = useActive();
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CurrentInputs>({
        defaultValues: {
            fabricanteId: 0,
            fabricante: "",
            modeloId: vehiculo?.modeloId || 0,
            modelo: "",
        },
    });

    const onSubmit: SubmitHandler<CurrentInputs> = (data) =>
        vehiculo
            ? feathersClient
                  .service("vehiculos")
                  .patch(vehiculo.id, {
                      patente: data.patente,
                      year: data.year,
                      combustible: data.combustible,
                      cilindrada: data.cilindrada,
                      vin: data.vin,
                      clienteId: clienteId,
                      modeloId: data.modeloId,
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error.message);
                  })
            : feathersClient
                  .service("vehiculos")
                  .create({
                      patente: data.patente.toUpperCase(),
                      year: data.year,
                      combustible: data.combustible,
                      cilindrada: data.cilindrada,
                      vin: data.vin.toUpperCase(),
                      clienteId: clienteId,
                      modeloId: data.modeloId,
                      createdAt: Date(),
                      updatedAt: Date(),
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error.message);
                  });

    useEffect(() => {
        reset();
    }, [isActive, vehiculo, reset]);

    return (
        <Form isActive={isActive} onSubmit={handleSubmit(onSubmit)}>
            <SelectModelo
                register={register}
                watch={watch}
                setValue={setValue}
                error={errors.modeloId ? true : false}
            />
            <Label title="Combustible">
                <select
                    {...register("combustible")}
                    defaultValue={vehiculo?.combustible}
                >
                    <option value="Nafta">Nafta</option>
                    <option value="Diesel">Diesel</option>
                    <option value="GNC">GNC</option>
                </select>
            </Label>
            <Label
                title="Cilindrada"
                error={errors.cilindrada && "Ingrese una cilindrada correcta"}
            >
                <input
                    type="number"
                    defaultValue={vehiculo?.cilindrada}
                    step="0.1"
                    placeholder="litros"
                    autoComplete="off"
                    {...(register("cilindrada"), { min: 0.1, max: 20 })}
                />
            </Label>
            <Label title="Año" error={errors.year && "Ingrese un año correcto"}>
                <input
                    type="number"
                    defaultValue={vehiculo?.year}
                    placeholder="-"
                    autoComplete="off"
                    {...(register("year"), { min: 1900, max: 9999 })}
                />
            </Label>
            <Label title="VIN" length={2} error={errors.vin?.message}>
                <input
                    type="text"
                    defaultValue={vehiculo?.vin}
                    placeholder="-"
                    autoComplete="off"
                    {...register("vin", {
                        minLength: {
                            value: 17,
                            message: "El VIN debe contener 17 caracteres",
                        },
                        maxLength: {
                            value: 17,
                            message: "El VIN debe contener 17 caracteres",
                        },
                        validate: (vin) =>
                            /\s/.test(vin)
                                ? "El vin no puede contener espacios"
                                : vin.includes("O")
                                ? "El vin no puede contener la letra O"
                                : vin.includes("I")
                                ? "El vin no puede contener la letra I"
                                : vin.includes("Q")
                                ? "El vin no puede contener la letra Q"
                                : true,
                    })}
                />
            </Label>
            <Label title="Patente" error={errors.patente?.message}>
                <input
                    type="text"
                    defaultValue={vehiculo?.patente}
                    placeholder="-"
                    autoComplete="off"
                    {...register("patente", {
                        required: "Ingrese la patente",
                        maxLength: {
                            value: 8,
                            message:
                                "La patente no puede contener mas de 8 caracteres",
                        },
                        validate: (patente) =>
                            /\s/.test(patente)
                                ? "La patente no puede contener espacios"
                                : true,
                    })}
                />
            </Label>
            <Label title="Propietario" length={2}>
                <select disabled name="clienteId">
                    <option value="">0</option>
                </select>
            </Label>
        </Form>
    );
};

export default VehiculoForm;
