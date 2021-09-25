import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import transition from "styled-transition-group";

import SectionComponent from "components/Section";
import Form from "./Form";
import Mensaje from "./Mensaje";

const Container = transition(SectionComponent).attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 150,
    },
})`
    will-change: opacity;
    position: absolute;
    z-index: 600;
    top: 3rem;
    right: 0;
    bottom: 0;
    left: 0;
    height: auto;
    padding: 0;
    overflow: overlay;
    border-radius: 4px;
    background: var(--surface);
    border-top: var(--border-variant);
    box-shadow: var(--shadow);
    display: grid;
    align-items: start;
    justify-items: center;
    gap: 0;

    &:enter {
        opacity: 0;
        transform: translateY(-1rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.3s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transform: translateY(-1rem);
        transition: 0.15s ease-in;
    }
`;

const Presupuesto = function ({
    presupuestoId,
    activeCard,
    setActiveCard,
    edit,
    unEdit,
    matchModelo,
}) {
    const [presupuesto, setPresupuesto] = useState({
        id: 0,
        patente: "",
        km: "",
        motivo: "",
        labor: "",
        repuestos: [{ cantidad: "", repuesto: "", precio: "" }],
        createdAt: "",
        updatedAt: "",
        modeloId: 0,
    });

    const loadPresupuesto = useCallback(() => {
        feathersClient
            .service("presupuestos")
            .get(presupuestoId)
            .then((found) => {
                setPresupuesto(found);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, [presupuestoId]);

    useEffect(() => {
        presupuestoId !== 0 && loadPresupuesto();
    }, [presupuestoId, loadPresupuesto]);

    return (
        <>
            <Form edit={edit} unEdit={unEdit} />
            <Container
                in={presupuestoId !== 0}
                overlay={activeCard === "Presupuesto" ? true : false}
                onClick={() => {
                    setActiveCard("");
                }}
            >
                <Mensaje
                    user={"montiel"}
                    factura={"mezannotte"}
                    presupuesto={presupuesto}
                    auto={matchModelo(presupuesto.modeloId)}
                />
            </Container>
        </>
    );
};

export default Presupuesto;
