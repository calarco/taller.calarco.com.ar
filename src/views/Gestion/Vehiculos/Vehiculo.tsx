import React from "react";
import styled, { css } from "styled-components";

type ActiveProps = {
    readonly active?: boolean;
};

const Container = styled.div<ActiveProps>`
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(0, 0, 0, 0);
    transition: 0.2s ease-in;

    &:hover {
        cursor: pointer;
        transition: 0.3s ease-out;
    }

    ${(props) =>
        props.active &&
        css`
            position: sticky;
            top: 0;
            bottom: 0;
            background: var(--primary);
            transition: 0.3s ease-out;

            &:hover {
                cursor: default;
                transition: 0.3s ease-out;
            }
        `};
`;

const Box = styled.article`
    padding: 8px 12px;
    background: var(--surface);
`;

const Buttons = styled.div<ActiveProps>`
    width: 100%;
    max-height: 0;
    overflow: hidden;
    text-align: center;
    display: flex;
    gap: 2px;

    button {
        width: 100%;
        background: var(--surface);
        transition: 0.25s ease-in;
    }

    ${(props) =>
        props.active &&
        css`
            max-height: 5rem;
            padding-top: 2px;
            transition: 0.3s ease-out;
        `};
`;

const Vehiculo = function ({
    vehiculo,
    matchModelo,
    onClick,
    selected,
    setSelected,
}) {
    return (
        <>
            <Container active={selected.vehiculoId === vehiculo.id}>
                {selected.vehiculoId === vehiculo.id &&
                selected.form === "vehiculo" ? (
                    <article>
                        <label>
                            Patente
                            <input
                                type="text"
                                name="reparacion"
                                placeholder="-"
                                autoComplete="off"
                                required
                            />
                        </label>
                    </article>
                ) : (
                    <Box onClick={onClick}>
                        <h4>
                            {matchModelo(vehiculo.modeloId)}
                            <p>{vehiculo.combustible}</p>
                        </h4>
                        <h5>
                            {vehiculo.patente}
                            <p>{vehiculo.year}</p>
                        </h5>
                    </Box>
                )}
                <Buttons active={selected.vehiculoId === vehiculo.id}>
                    <button onClick={() => {}}>Borrar</button>
                    <button
                        onClick={() => {
                            setSelected({
                                clienteId: vehiculo.clienteId,
                                vehiculoId: vehiculo.id,
                                reparacionId: 0,
                                form: "vehiculo",
                            });
                        }}
                    >
                        Editar
                    </button>
                </Buttons>
            </Container>
        </>
    );
};

export default Vehiculo;
