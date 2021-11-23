import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import feathersClient from "feathersClient";
import styled from "styled-components";

import FormComponent from "components/Form";
import Label from "components/Label";

const Container = styled(FormComponent)`
    grid-template-columns: 1fr 1fr [end];
`;

type Inputs = {
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    telefono: string;
    empresa: string;
};

type ComponentProps = {
    cliente?: Cliente;
    isActive: boolean;
};

const Form = function ({ cliente, isActive }: ComponentProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const capitalize = (text: string) => {
        return text
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
    };

    const onSubmit: SubmitHandler<Inputs> = (data) =>
        cliente
            ? feathersClient
                  .service("clientes")
                  .patch(cliente.id, {
                      nombre: capitalize(data.nombre),
                      apellido: capitalize(data.apellido),
                      dni: data.dni,
                      empresa: data.empresa,
                      telefono: data.telefono,
                      email: data.email.toLowerCase(),
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error);
                  })
            : feathersClient
                  .service("clientes")
                  .create({
                      nombre: capitalize(data.nombre),
                      apellido: capitalize(data.apellido),
                      dni: data.dni,
                      empresa: data.empresa,
                      telefono: data.telefono,
                      email: data.email.toLowerCase(),
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error.message);
                  });

    useEffect(() => {
        reset();
    }, [isActive, reset]);

    return (
        <Container isActive={isActive} onSubmit={handleSubmit(onSubmit)}>
            <Label title="Nombre" error={errors.nombre?.message}>
                <input
                    type="text"
                    defaultValue={cliente?.nombre}
                    placeholder="-"
                    autoComplete="off"
                    {...register("nombre", { required: "Ingrese el nombre" })}
                />
            </Label>
            <Label title="Apellido" error={errors.apellido?.message}>
                <input
                    type="text"
                    defaultValue={cliente?.apellido}
                    placeholder="-"
                    autoComplete="off"
                    {...register("apellido", {
                        required: "Ingrese el apellido",
                    })}
                />
            </Label>
            <Label title="DNI / CUIT / CUIL">
                <input
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                    {...register("dni")}
                    defaultValue={cliente?.dni}
                />
            </Label>
            <Label title="Empresa">
                <input
                    type="text"
                    defaultValue={cliente?.empresa}
                    placeholder="-"
                    autoComplete="off"
                    {...register("empresa")}
                />
            </Label>
            <Label title="Telefono">
                <input
                    type="tel"
                    defaultValue={cliente?.telefono}
                    pattern="\d*"
                    placeholder="-"
                    autoComplete="off"
                    {...register("telefono")}
                />
            </Label>
            <Label title="Correo electrónico">
                <input
                    type="email"
                    defaultValue={cliente?.email}
                    placeholder="-"
                    autoComplete="off"
                    {...register("email")}
                />
            </Label>
        </Container>
    );
};

export default Form;
