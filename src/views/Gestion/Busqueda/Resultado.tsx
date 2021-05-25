import React from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: 4px 0;
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
    }
`;

const Icon = styled.div`
    position: relative;
    margin: 0 24px;

    i {
        color: var(--on-background-variant);
    }
`;

const Resultado = function ({ type, id, h1, h2, h3, onClick }) {
    return (
        <>
            <Container key={id} onClick={onClick} tabIndex={0}>
                <Icon>
                    <i className="material-icons md-24">
                        {type === "vehiculo" ? "directions_car" : "person"}
                    </i>
                </Icon>
                <div>
                    <h6>
                        {h1}
                        <p> {h2}</p>
                    </h6>
                    <p>{h3}</p>
                </div>
            </Container>
        </>
    );
};

export default Resultado;
