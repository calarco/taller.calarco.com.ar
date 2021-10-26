import React, { MouseEvent } from "react";
import styled from "styled-components";

const Container = styled.article`
    padding: 1.5rem 2rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
`;

const Numbers = styled.div`
    text-align: right;
`;

type ComponentProps = {
    reparacion: Reparacion;
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

const ReparacionBox = function ({ reparacion, onClick }: ComponentProps) {
    return (
        <Container onClick={onClick}>
            <h5>
                {reparacion.createdAt &&
                    Intl.DateTimeFormat("default", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }).format(new Date(reparacion.createdAt))}
                <small>{reparacion.km} km</small>
            </h5>
            <Numbers>Total</Numbers>
            <h4>
                $
                {parseInt(reparacion.costo, 10) +
                    parseInt(reparacion.labor, 10)}
            </h4>
            <div>
                <h4>{reparacion.reparacion}</h4>
            </div>
            <Numbers>
                <h6>${reparacion.labor}</h6>
            </Numbers>
            <label>Mano de obra</label>
            <p>{reparacion.repuestos}</p>
            <Numbers>
                <h6>${reparacion.costo}</h6>
            </Numbers>
            <label>Repuestos</label>
        </Container>
    );
};

export default ReparacionBox;
