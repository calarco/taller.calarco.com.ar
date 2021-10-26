import React, {
    MouseEvent,
    FormEvent,
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import feathersClient from "feathersClient";

import FormComponent from "components/Form";
import Modelo from "components/Modelo";

type Inputs = {
    fecha: string;
    motivo: string;
    fabricanteId: number;
    fabricante: string;
    modeloId: number;
    modelo: string;
};

type ComponentProps = {
    turno: Turno;
    edit: boolean;
    unEdit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Form = function ({ turno, edit, unEdit }: ComponentProps) {
    const [inputs, setInputs] = useState<Inputs>({
        fecha: "",
        motivo: "",
        fabricanteId: 0,
        fabricante: "",
        modeloId: 0,
        modelo: "",
    });

    const capitalize = (text: string) => {
        return text
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
    };

    function validate(inputs: Inputs) {
        let error = "";
        inputs.modeloId === 0
            ? (error = "Seleccione un modelo")
            : inputs.motivo === ""
            ? (error = "Ingrese el motivo")
            : (error = "");
        return error;
    }

    const handleCreate = (event: FormEvent) => {
        event.preventDefault();
        validate(inputs) === "" &&
            feathersClient
                .service("turnos")
                .create({
                    fecha: inputs.fecha,
                    motivo: inputs.motivo,
                    modeloId: inputs.modeloId,
                })
                .then(() => {})
                .catch((error: FeathersErrorJSON) => {
                    console.error(error.message);
                });
    };

    const handleEdit = (event: FormEvent) => {
        event.preventDefault();
        validate(inputs) === "" &&
            feathersClient
                .service("turnos")
                .patch(turno.id, {
                    fecha: inputs.fecha,
                    motivo: inputs.motivo,
                    modeloId: inputs.modeloId,
                })
                .then(() => {})
                .catch((error: FeathersErrorJSON) => {
                    console.error(error.message);
                });
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]:
                event.target.name === "motivo"
                    ? capitalize(event.target.value)
                    : event.target.value,
        }));
    };

    useEffect(() => {
        setInputs({
            fecha: turno.fecha,
            motivo: turno.motivo,
            fabricanteId: 0,
            fabricante: "",
            modeloId: turno.modeloId,
            modelo: "",
        });
    }, [turno]);

    return (
        <FormComponent
            edit={edit}
            unEdit={unEdit}
            onSubmit={turno.id === 0 ? handleCreate : handleEdit}
        >
            <label>
                Motivo
                <input
                    type="text"
                    name="motivo"
                    placeholder="-"
                    autoComplete="off"
                    value={inputs.motivo}
                    onChange={handleInputChange}
                />
            </label>
            <Modelo
                inputs={inputs}
                setInputs={setInputs}
                onChange={handleInputChange}
            />
        </FormComponent>
    );
};

export default Form;
