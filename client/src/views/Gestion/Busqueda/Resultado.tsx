import React from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 1.5rem 2.5rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--on-background-disabled);
    transition: 0.1s ease-in;

    &:hover {
        cursor: pointer;
        background: var(--on-background-disabled);
        transition: 0.15s ease-out;
    }

    div {
        pointer-events: none;
        width: 100%;
        display: grid;
        gap: 1rem;
    }
`;

const Icon = styled.label`
    position: relative;

    i {
        color: var(--on-background-variant);
    }
`;

const Resultado = function ({ type, id, h1, h2, h3, onClick }) {
    return (
        <>
            <Container key={id} onClick={onClick} tabIndex={0}>
                <div>
                    <h6>
                        {h1}
                        <small>{h2}</small>
                    </h6>
                    <p>{h3}</p>
                </div>
                <Icon>{type === "vehiculo" ? "Vehiculo" : "Cliente"}</Icon>
            </Container>
        </>
    );
};

export default Resultado;
