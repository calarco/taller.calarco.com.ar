import React, { MouseEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import feathersClient from "feathersClient";
import styled from "styled-components";

import FormComponent from "components/Form";
import Label from "components/Label";
import ModeloComponent from "components/Modelo";

const Container = styled(FormComponent)`
    grid-template-columns: 1fr 1fr 1fr [end];
`;

const Modelo = styled(ModeloComponent)`
    grid-column-end: span 2;
    grid-row-end: span 2;
    grid-auto-flow: row;
`;

type Inputs = {
    motivo?: string;
    patente: string;
    year: string;
    combustible: string;
    cilindrada: string;
    vin: string;
    clienteId: number;
    fabricanteId: number;
    fabricante: string;
    modeloId: number;
    modelo: string;
};

type ComponentProps = {
    vehiculo: Vehiculo;
    edit: boolean;
    unEdit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Form = function ({ vehiculo, edit, unEdit }: ComponentProps) {
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) =>
        vehiculo.id === 0
            ? feathersClient
                  .service("vehiculos")
                  .create({
                      patente: data.patente.toUpperCase(),
                      year: data.year,
                      combustible: data.combustible,
                      cilindrada: data.cilindrada,
                      vin: data.vin.toUpperCase(),
                      clienteId: data.clienteId,
                      modeloId: data.modeloId,
                      createdAt: Date(),
                      updatedAt: Date(),
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error.message);
                  })
            : feathersClient
                  .service("vehiculos")
                  .patch(vehiculo.id, {
                      patente: data.patente,
                      year: data.year,
                      combustible: data.combustible,
                      cilindrada: data.cilindrada,
                      vin: data.vin,
                      clienteId: data.clienteId,
                      modeloId: data.modeloId,
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error.message);
                  });

    useEffect(() => {
        reset();
    }, [vehiculo]);

    return (
        <Container
            edit={edit}
            unEdit={unEdit}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Modelo register={register} watch={watch} setValue={setValue} />
            <Label title="Combustible">
                <select {...register("combustible")}>
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
                    step="0.1"
                    placeholder="litros"
                    autoComplete="off"
                    {...(register("cilindrada"), { min: 0.1, max: 20 })}
                />
            </Label>
            <Label title="Año" error={errors.year && "Ingrese un año correcto"}>
                <input
                    type="number"
                    placeholder="-"
                    autoComplete="off"
                    {...(register("year"), { min: 1900, max: 9999 })}
                />
            </Label>
            <Label
                title="VIN"
                length={2}
                error={errors.vin && "Ingrese un VIN correcto"}
            >
                <input
                    type="text"
                    defaultValue=""
                    placeholder="-"
                    autoComplete="off"
                    {...register("vin", { minLength: 17 })}
                />
            </Label>
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
            <Label title="Propietario" length={2}>
                <select disabled name="clienteId">
                    <option value="">0</option>
                </select>
            </Label>
        </Container>
    );
};

export default Form;
