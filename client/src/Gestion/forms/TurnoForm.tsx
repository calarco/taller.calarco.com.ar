import React, { MouseEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import feathersClient from "feathersClient";

import FormComponent from "components/Form";
import Label from "components/Label";
import SelectModelo from "components/SelectModelo";

type ComponentProps = {
    fecha: string;
    isActive: boolean;
    exit: (event: MouseEvent<HTMLButtonElement>) => void;
};

const Form = function ({ fecha, isActive, exit }: ComponentProps) {
    const {
        register,
        watch,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            fabricanteId: 0,
            fabricante: "",
            modeloId: 0,
            modelo: "",
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) =>
        feathersClient
            .service("turnos")
            .create({
                fecha: fecha,
                motivo: data.motivo,
                modeloId: data.modeloId,
            })
            .then(() => {})
            .catch((error: FeathersErrorJSON) => {
                console.error(error.message);
            });

    return (
        <FormComponent
            isActive={isActive}
            exit={exit}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Label title="Motivo" error={errors.motivo?.message}>
                <input
                    type="text"
                    defaultValue=""
                    placeholder="-"
                    autoComplete="off"
                    {...register("motivo", { required: "Ingrese el motivo" })}
                />
            </Label>
            <SelectModelo
                register={register}
                watch={watch}
                setValue={setValue}
                error={errors.modeloId ? true : false}
            />
        </FormComponent>
    );
};

export default Form;
