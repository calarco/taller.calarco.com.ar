import React from "react";
import styled from "styled-components";

import { useActive } from "Gestion/context/activeContext";
import useResultados from "Gestion/hooks/useResultados";
import SectionComponent from "components/Section";
import ClienteBox from "./ClienteBox";
import VehiculoBox from "./VehiculoBox";
import PresupuestoBox from "./PresupuestoBox";

const Section = styled(SectionComponent)`
    content-visibility: auto;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    padding: 0;
    padding-top: 3rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const Empty = styled.h5`
    padding: 2rem;
    text-align: center;
    color: var(--on-background-variant);
`;

type ComponentProps = {
    busqueda: string;
};

const Busqueda = function ({ busqueda }: ComponentProps) {
    const { activeCard } = useActive();
    const { resultados } = useResultados({
        busqueda: busqueda,
    });

    return (
        <Section overlay={activeCard === "Presupuesto" ? true : false}>
            {resultados[0] && resultados[0].id !== 0 ? (
                resultados.map((aResult, index) =>
                    aResult.km &&
                    aResult.motivo &&
                    aResult.labor &&
                    aResult.repuestos ? (
                        <PresupuestoBox
                            key={index}
                            presupuesto={{
                                id: aResult.id,
                                patente: aResult.patente || "",
                                km: aResult.km,
                                motivo: aResult.motivo,
                                labor: aResult.labor,
                                repuestos: aResult.repuestos,
                                createdAt: aResult.createdAt,
                                updatedAt: aResult.updatedAt,
                                modeloId: aResult.modeloId || 0,
                            }}
                        />
                    ) : aResult.patente && aResult.clienteId ? (
                        <VehiculoBox
                            key={index}
                            vehiculo={{
                                id: aResult.id,
                                patente: aResult.patente,
                                year: aResult.year || "",
                                combustible: aResult.combustible || "",
                                cilindrada: aResult.cilindrada || "",
                                vin: aResult.vin || "",
                                clienteId: aResult.clienteId,
                                createdAt: aResult.createdAt,
                                updatedAt: aResult.updatedAt,
                                modeloId: aResult.modeloId || 0,
                            }}
                        />
                    ) : aResult.nombre && aResult.apellido ? (
                        <ClienteBox
                            key={aResult.id}
                            cliente={{
                                id: aResult.id,
                                nombre: aResult.nombre,
                                apellido: aResult.apellido,
                                dni: aResult.dni || "",
                                email: aResult.email || "",
                                empresa: aResult.empresa || "",
                                telefono: aResult.telefono || "",
                                createdAt: aResult.createdAt,
                                updatedAt: aResult.updatedAt,
                            }}
                        />
                    ) : undefined
                )
            ) : (
                <Empty>No se encontraron resultados</Empty>
            )}
        </Section>
    );
};

export default Busqueda;
