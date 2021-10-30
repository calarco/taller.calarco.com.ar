import React, { MouseEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import feathersClient from "feathersClient";
import styled from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import FormComponent from "components/Form";
import Label from "components/Label";

const Container = styled(FormComponent)`
    grid-template-columns: auto 1fr auto [end];
`;

const Number = styled(Label)`
    text-align: right;
`;

type Inputs = {
    fecha: string;
    km: string;
    reparacion: string;
    repuestos: string;
    labor: string;
    costo: string;
};

type ComponentProps = {
    reparacion?: Reparacion;
    edit: boolean;
    unEdit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Form = function ({ reparacion, edit, unEdit }: ComponentProps) {
    const { vehiculoId } = useActive();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.substring(1);
    };

    const onSubmit: SubmitHandler<Inputs> = (data) =>
        reparacion
            ? feathersClient
                  .service("reparaciones")
                  .patch(reparacion.id, {
                      km: parseInt(data.km),
                      reparacion: capitalize(data.reparacion),
                      repuestos: capitalize(data.repuestos),
                      costo: data.costo,
                      labor: data.labor,
                  })
                  .then(() => {})
                  .catch((error: FeathersErrorJSON) => {
                      console.error(error.message);
                  })
            : feathersClient
                  .service("reparaciones")
                  .create({
                      km: parseInt(data.km),
                      reparacion: capitalize(data.reparacion),
                      repuestos: capitalize(data.repuestos),
                      costo: data.costo,
                      labor: data.labor,
                      vehiculoId: vehiculoId,
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
            <Label title="Fecha" error={errors.fecha && "Ingrese la fecha"}>
                <input
                    type="date"
                    placeholder="-"
                    autoComplete="off"
                    {...register("fecha", { required: true })}
                    defaultValue={
                        reparacion
                            ? reparacion.createdAt.substring(0, 10)
                            : new Date().toISOString().substring(0, 10)
                    }
                />
            </Label>
            <Label title="KM" error={errors.km && "Ingrese los km"}>
                <input
                    type="number"
                    min="0000000"
                    max="9999999"
                    placeholder="-"
                    autoComplete="off"
                    {...register("km", { required: true })}
                    defaultValue={reparacion?.km}
                />
            </Label>
            <Number title="Total">
                <h4>
                    $
                    {(parseInt(watch("costo"), 10) || 0) +
                        (parseInt(watch("labor"), 10) || 0)}
                </h4>
            </Number>
            <Label
                title="Reparación"
                error={errors.reparacion && "Ingrese la reparacion"}
                length={2}
            >
                <input
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                    {...register("reparacion", { required: true })}
                    defaultValue={reparacion?.reparacion}
                />
            </Label>
            <Number title="Mano de obra">
                <input
                    type="number"
                    min="0000000"
                    max="9999999"
                    placeholder="-"
                    autoComplete="off"
                    {...register("labor", { required: true })}
                    defaultValue={reparacion?.labor}
                />
            </Number>
            <Label title="Repuestos" length={2}>
                <input
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                    {...register("repuestos")}
                    defaultValue={reparacion?.repuestos}
                />
            </Label>
            <Number title="Repuestos">
                <input
                    type="number"
                    min="0000000"
                    max="9999999"
                    placeholder="-"
                    autoComplete="off"
                    {...register("costo", { required: true })}
                    defaultValue={reparacion?.costo}
                />
            </Number>
        </Container>
    );
};

export default Form;
