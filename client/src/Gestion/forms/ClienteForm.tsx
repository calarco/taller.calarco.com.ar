import React, { MouseEvent } from "react";
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
    edit: boolean;
    unEdit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Form = function ({ cliente, edit, unEdit }: ComponentProps) {
    const {
        register,
        handleSubmit,
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

    return (
        <Container
            edit={edit}
            unEdit={unEdit}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Label title="Nombre" error={errors.nombre && "Ingrese el nombre"}>
                <input
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                    {...register("nombre", { required: true })}
                    defaultValue={cliente?.nombre}
                />
            </Label>
            <Label
                title="Apellido"
                error={errors.apellido && "Ingrese el apellido"}
            >
                <input
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                    {...register("apellido", { required: true })}
                    defaultValue={cliente?.apellido}
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
                    placeholder="-"
                    autoComplete="off"
                    {...register("empresa")}
                    defaultValue={cliente?.empresa}
                />
            </Label>
            <Label title="Telefono">
                <input
                    type="tel"
                    pattern="\d*"
                    placeholder="-"
                    autoComplete="off"
                    {...register("telefono")}
                    defaultValue={cliente?.telefono}
                />
            </Label>
            <Label title="Correo electrónico">
                <input
                    type="email"
                    placeholder="-"
                    autoComplete="off"
                    {...register("email")}
                    defaultValue={cliente?.email}
                />
            </Label>
        </Container>
    );
};

export default Form;
