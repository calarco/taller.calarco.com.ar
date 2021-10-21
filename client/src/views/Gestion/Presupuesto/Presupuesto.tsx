import React, { useState, useEffect, useCallback } from "react";
import feathersClient from "feathersClient";
import styled from "styled-components";
import transition from "styled-transition-group";

import { useGestion } from "views/Gestion/context";
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

const Buttons = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    border-radius: 4px;
    background: var(--primary-variant);
    backdrop-filter: blur(0.4rem);
    border: 1px solid var(--primary);
    box-shadow: var(--shadow);
    display: grid;
    grid-template-columns: 2fr 3fr 2fr;
    align-items: center;
    gap: 0.5rem;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        margin: 0;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;
        border: none;

        &:first-child::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            right: 0;
            height: 2rem;
            border-right: 1px solid var(--primary-variant);
        }
    }
`;

const Presupuesto = function ({ edit, unEdit, matchModelo }) {
    const { presupuestoId, setPresupuestoId, activeCard, setActiveCard } =
        useGestion();
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
    const [inputs, setInputs] = useState({
        email: "",
    });

    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    const loadPresupuesto = useCallback(
        (last?: boolean) => {
            last
                ? feathersClient
                      .service("presupuestos")
                      .find({
                          query: {
                              $limit: 1,
                              $sort: {
                                  updatedAt: -1,
                              },
                          },
                      })
                      .then((found) => {
                          setPresupuesto(found.data[0]);
                          setPresupuestoId(found.data[0].id);
                          setActiveCard("");
                      })
                      .catch((error) => {
                          console.error(error);
                      })
                : feathersClient
                      .service("presupuestos")
                      .get(presupuestoId)
                      .then((found) => {
                          setPresupuesto(found);
                      })
                      .catch((error) => {
                          console.log("error", error);
                      });
        },
        [presupuestoId, setPresupuestoId, setActiveCard]
    );

    useEffect(() => {
        feathersClient
            .service("presupuestos")
            .on("created", () => loadPresupuesto(true));
        feathersClient
            .service("presupuestos")
            .on("removed", () => setPresupuestoId(0));
    }, [loadPresupuesto, setPresupuestoId]);

    useEffect(() => {
        presupuestoId !== 0 && loadPresupuesto();
    }, [presupuestoId, loadPresupuesto]);

    return (
        <>
            <Form edit={edit} unEdit={unEdit} matchModelo={matchModelo} />
            <Container
                in={presupuestoId !== 0}
                overlay={activeCard === "Presupuesto" ? true : false}
                onClick={() => {
                    setActiveCard("");
                }}
            >
                <Buttons>
                    <button type="button" onClick={unEdit}>
                        Borrar
                    </button>
                    <input
                        type="email"
                        name="email"
                        placeholder="Direccion de correo"
                        value={inputs.email}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Enviar</button>
                </Buttons>
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
