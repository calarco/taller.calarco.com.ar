import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    border-radius: 2px;
    background: var(--surface);
    border: 1px solid var(--primary);
`;

const Buttons = styled.div`
    grid-area: buttons;
    text-align: center;
    display: flex;

    button {
        width: 100%;
    }
`;

const Form = styled.form`
    transition: 0.25s ease-in;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;

    div {
    }
`;

const NuevoTurno = function ({}) {
    const [open, setOpen] = useState(false);
    const [inputs, setInputs] = useState({
        fecha: new Date().toISOString().substring(0, 10),
        motivo: "",
        createdAt: "1994-01-20T00:00:00",
        updatedAt: "1994-01-20T00:00:00",
    });
    const [labels, setLabels] = useState({ motivo: "Motivo" });

    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLabels(validate(inputs));
        if (Object.keys(validate(inputs)).length === 0) {
        }
    };

    function validate(inputs) {
        let errores = { motivo: "Motivo" };
        if (!inputs.motivo) {
            errores.motivo = "Ingrese la motivo";
        }
        return errores;
    }

    return (
        <Container>
            {open ? (
                <>
                    <Form onSubmit={handleSubmit} noValidate>
                        <label>
                            {labels.motivo}
                            <input
                                type="text"
                                name="motivo"
                                placeholder="-"
                                value={inputs.motivo}
                                onChange={handleInputChange}
                                autoComplete="off"
                                required
                            />
                        </label>
                    </Form>
                    <Buttons>
                        <button
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancelar
                        </button>
                        <button type="submit">Agregar Turno</button>
                    </Buttons>
                </>
            ) : (
                <Buttons>
                    <button
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        Agregar Turno
                    </button>
                </Buttons>
            )}
        </Container>
    );
};

export default NuevoTurno;
