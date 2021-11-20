import React from "react";
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

type CurrentInputs = Inputs & {
    reparacion: string;
    repuestos: string;
    labor: number;
    costo: number;
};

type ComponentProps = {
    reparacion?: Reparacion;
    isActive: boolean;
};

const Form = function ({ reparacion, isActive }: ComponentProps) {
    const { vehiculoId, setActiveCard } = useActive();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CurrentInputs>();

    const capitalize = (text: string) => {
        return text.charAt(0).toUpperCase() + text.substring(1);
    };

    const onSubmit: SubmitHandler<CurrentInputs> = (data) =>
        reparacion
            ? feathersClient
                  .service("reparaciones")
                  .patch(reparacion.id, {
                      km: data.km,
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
                      km: data.km,
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
            isActive={isActive}
            exit={() => {
                setActiveCard("");
            }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Label title="Fecha" error={errors.fecha?.message}>
                <input
                    type="date"
                    defaultValue={
                        reparacion
                            ? reparacion.createdAt.substring(0, 10)
                            : new Date().toISOString().substring(0, 10)
                    }
                    placeholder="-"
                    autoComplete="off"
                    {...register("fecha", { required: "Ingrese la fecha" })}
                />
            </Label>
            <Label title="KM" error={errors.km?.message}>
                <input
                    type="number"
                    defaultValue={reparacion?.km}
                    min="0000000"
                    max="9999999"
                    placeholder="-"
                    autoComplete="off"
                    {...register("km", { required: "Ingrese los km" })}
                />
            </Label>
            <Number title="Total">
                <h4>${watch("costo") + watch("labor")}</h4>
            </Number>
            <Label
                title="Reparación"
                error={errors.reparacion?.message}
                length={2}
            >
                <input
                    type="text"
                    placeholder="-"
                    autoComplete="off"
                    {...register("reparacion", {
                        required: "Ingrese la reparacion",
                    })}
                    defaultValue={reparacion?.reparacion}
                />
            </Label>
            <Number title="Mano de obra">
                <input
                    type="number"
                    defaultValue={reparacion?.labor}
                    min="0000000"
                    max="9999999"
                    placeholder="-"
                    autoComplete="off"
                    {...register("labor", { required: true })}
                />
            </Number>
            <Label title="Repuestos" length={2}>
                <input
                    type="text"
                    defaultValue={reparacion?.repuestos}
                    placeholder="-"
                    autoComplete="off"
                    {...register("repuestos")}
                />
            </Label>
            <Number title="Repuestos">
                <input
                    type="number"
                    defaultValue={reparacion?.costo}
                    min="0000000"
                    max="9999999"
                    placeholder="-"
                    autoComplete="off"
                    {...register("costo", { required: true })}
                />
            </Number>
        </Container>
    );
};

export default Form;
