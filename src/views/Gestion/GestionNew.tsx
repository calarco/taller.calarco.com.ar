import React from "react";
import styled from "styled-components";
import { Button, FormItem } from "components/components";
import { FullDialog } from "components/dialogs";

const TopBar = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding-right: 12px;

    span {
        flex-grow: 1;
        font-size: 20px;
        font-size: 2rem;
        line-height: 28px;
        line-height: 2.8rem;
        letter-spacing: 0.05px;
        letter-spacing: 0.005rem;
        font-weight: 400;
        text-transform: inherit;
    }
`;

const Items = styled.div`
    padding: 0 12px 20px 12px;
`;

const AppointmentsNew = function ({ newOpen, setNewOpen, setSnackbar }) {
    const nodeRef = React.useRef(null);

    const submit = (event) => {
        event.preventDefault();
        setSnackbar("Reparacion creada");
    };

    return (
        <FullDialog
            nodeRef={nodeRef}
            isActive={newOpen}
            handleClose={() => setNewOpen(false)}
        >
            <form onSubmit={submit} noValidate>
                <TopBar>
                    <Button
                        icon
                        type="button"
                        onClick={() => {
                            setNewOpen(false);
                        }}
                    >
                        <i className="material-icons md-24">close</i>
                    </Button>
                    <span>Nuevo turno</span>
                    <Button solid type="submit">
                        Guardar
                    </Button>
                </TopBar>
                <Items>
                    <FormItem half>
                        <p>Fecha</p>
                        <input
                            type="date"
                            name="fecha"
                            placeholder="-"
                            required
                        />
                    </FormItem>
                    <FormItem half>
                        <p>Hora</p>
                        <input
                            type="time"
                            step="900"
                            name="fecha"
                            placeholder="-"
                            required
                        />
                    </FormItem>
                    <FormItem>
                        <p>Paciente</p>
                        <select name="fabricanteId">
                            <option>Sebastian Calarco</option>
                            <option>2</option>
                        </select>
                    </FormItem>
                    <FormItem>
                        <p>Motivo</p>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="-"
                            autoComplete="off"
                            required
                        />
                    </FormItem>
                </Items>
            </form>
        </FullDialog>
    );
};

export default AppointmentsNew;
