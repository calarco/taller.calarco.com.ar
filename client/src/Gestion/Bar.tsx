import React from "react";
import styled from "styled-components";

const Container = styled.main`
    width: 100%;
    border-radius: 4px 4px 0 0;
    background: var(--surface-variant);
    border-top: var(--border-variant);
    box-shadow: var(--shadow-variant);
    text-align: right;

    button {
        height: 100%;
        margin: 0;
        padding: 0.25rem 0.55rem;
        border: none;
        font: var(--label);
        font: 500 0.75rem/1.25rem var(--font-family);

        &::after {
            content: "";
            position: absolute;
            top: calc(50% - 0.5rem);
            left: 0;
            height: 1rem;
            border-left: var(--border);
        }
    }
`;

const Bar = function ({ setUser, darkTheme, setDarkTheme }) {
    return (
        <Container>
            {darkTheme ? (
                <button
                    type="button"
                    onClick={() => {
                        setDarkTheme(false);
                    }}
                >
                    Tema Claro
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => {
                        setDarkTheme(true);
                    }}
                >
                    Tema Oscuro
                </button>
            )}
            <button
                type="button"
                onClick={() => {
                    window.localStorage.removeItem("feathers-jwt");
                    setUser(null);
                }}
            >
                Cerrar sesión
            </button>
        </Container>
    );
};

export default Bar;
