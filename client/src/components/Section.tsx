import React, { useState, useEffect, useTransition } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";

import Cliente from "views/Gestion/Clientes/Cliente";
import Vehiculo from "views/Gestion/Vehiculos/Vehiculo";
import Reparacion from "views/Gestion/Reparaciones/Reparacion";

type Props = {
    readonly type?: string;
    readonly active?: boolean;
    readonly state?: string;
};

const Container = styled.section<Props>`
    visibility: hidden;
    opacity: 0;
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 1rem 1.5rem;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: 5s ease-out;

    ${(props) =>
        props.active &&
        css`
            overflow: hidden;
            transition: none;
        `};

    ${(props) =>
        props.type === "clientes" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            padding: 0;
            border-radius: 4px;
            box-shadow: var(--shadow-variant);
            overflow: visible;
            background: var(--surface);
            gap: 0;
        `};

    ${(props) =>
        props.type === "vehiculos" &&
        css`
            min-height: 25rem;
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 2;
            grid-row-end: 2;
            border-radius: 4px;
            border-top: var(--border-variant);
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        !props.active &&
        css`
            min-height: 21.5rem;
            background: var(--surface);
            box-shadow: var(--shadow);
        `};

    ${(props) =>
        props.state === "entered" &&
        css`
            visibility: visible;
            opacity: 1;
            transform: initial;
            transition: 0.3s ease-in;
        `};
`;

const Overlay = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    background: var(--surface-variant);
    backdrop-filter: blur(0.5rem);
    transition: 0.25s ease-in;

    ${(props) =>
        props.active &&
        css`
            visibility: visible;
            opacity: 1;
            height: 1000%;
            transform: initial;
            transition: 0.3s ease-out;
        `};
`;

const Section = function ({
    active,
    setActive,
    type,
    clienteId,
    setClienteId,
    vehiculoId,
    setVehiculoId,
    matchModelo,
    data,
    loadData,
    state,
}) {
    const [inactive, setInactive] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [selected, setSelected] = useState(0);
    const [create, setCreate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        feathersClient.service(type).on("created", () => loadData());
        feathersClient.service(type).on("patched", () => loadData());
        feathersClient.service(type).on("removed", () => loadData());
    }, [type, loadData]);

    useEffect(() => {
        setCreate(false);
        setEdit(false);
        setSelected(0);
    }, [clienteId, vehiculoId]);

    useEffect(() => {
        type !== "reparaciones" &&
            startTransition(() => {
                loadData();
            });
    }, [type, clienteId, startTransition, loadData]);

    useEffect(() => {
        type === "reparaciones" &&
            startTransition(() => {
                loadData();
            });
    }, [type, vehiculoId, startTransition, loadData]);

    useEffect(() => {
        (type === "vehiculos" && active === "clientes") ||
        (type === "reparaciones" &&
            (active === "clientes" || active === "vehiculos"))
            ? setInactive(true)
            : setInactive(false);
        active !== type && setCreate(false);
        active !== type && setEdit(false);
    }, [type, active]);

    useEffect(() => {
        !inactive && !create && !edit ? setOverlay(false) : setOverlay(true);
        !inactive && !create && !edit && setActive("");
        (create || edit) && setActive(type);
    }, [type, inactive, create, edit, setActive]);

    return (
        <Container type={type} active={overlay} state={state}>
            {isPending ? " Loading..." : null}
            {type === "clientes" && (
                <>
                    {clienteId === 0 ? (
                        <Cliente
                            active={true}
                            setActiveId={setClienteId}
                            edit={true}
                            setEdit={setCreate}
                            cliente={{
                                id: 0,
                                nombre: "",
                                apellido: "",
                                dni: "",
                                empresa: "",
                                telefono: "",
                                email: "",
                                createdAt: "",
                                updatedAt: "",
                            }}
                        />
                    ) : (
                        <Cliente
                            active={true}
                            setActiveId={setClienteId}
                            edit={edit}
                            setEdit={setEdit}
                            cliente={data}
                        />
                    )}
                </>
            )}
            {type === "vehiculos" && (
                <>
                    <Vehiculo
                        active={!data[0] ? true : false}
                        setActiveId={setVehiculoId}
                        onClick={() => setVehiculoId(0)}
                        edit={inactive ? false : create}
                        setEdit={setCreate}
                        matchModelo={matchModelo}
                        vehiculo={{
                            id: 0,
                            patente: "",
                            year: "",
                            combustible: "Nafta",
                            cilindrada: "",
                            createdAt: "",
                            updatedAt: "",
                            clienteId: clienteId,
                            modeloId: 0,
                        }}
                    />
                    {data[0] &&
                        data.map((aVehiculo) => (
                            <Vehiculo
                                key={aVehiculo.id}
                                active={
                                    vehiculoId === aVehiculo.id ? true : false
                                }
                                setActiveId={setVehiculoId}
                                onClick={() => setVehiculoId(aVehiculo.id)}
                                edit={
                                    vehiculoId === aVehiculo.id && edit
                                        ? true
                                        : false
                                }
                                setEdit={setEdit}
                                matchModelo={matchModelo}
                                vehiculo={aVehiculo}
                            />
                        ))}
                </>
            )}
            {type === "reparaciones" && (
                <>
                    <Reparacion
                        active={!data[0] ? true : false}
                        setActiveId={setSelected}
                        edit={inactive ? false : create}
                        setEdit={setCreate}
                        reparacion={{
                            id: 0,
                            vehiculoId: vehiculoId,
                            reparacion: "",
                            repuestos: "",
                            labor: "0",
                            costo: "0",
                            km: data[0] ? data[0].km : "0",
                            createdAt: new Date().toISOString(),
                            updatedAt: "",
                        }}
                    />
                    {data[0] &&
                        data.map((aReparacion) => (
                            <Reparacion
                                key={aReparacion.id}
                                active={
                                    selected === aReparacion.id ? true : false
                                }
                                setActiveId={setSelected}
                                edit={
                                    selected === aReparacion.id && edit
                                        ? true
                                        : false
                                }
                                setEdit={setEdit}
                                reparacion={aReparacion}
                            />
                        ))}
                </>
            )}
            {type !== "clientes" && (
                <Overlay
                    active={overlay}
                    onClick={() => {
                        setActive("");
                    }}
                />
            )}
        </Container>
    );
};

export default Section;
