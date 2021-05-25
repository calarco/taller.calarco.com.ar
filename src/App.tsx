import React, { useState, useEffect } from "react";
import { Transition } from "react-transition-group";
import styled, { css, ThemeProvider } from "styled-components";
import feathersClient from "feathersClient";

import { themeDark, themeLight } from "themes";
import GlobalStyle, { Device } from "components/globalStyle";
import Login from "views/Login/Login";
import { Turnos } from "views/Turnos";
import { Gestion } from "views/Gestion";

type StateProps = {
    readonly state?: string;
};

const Main = styled.div<StateProps>`
    padding-bottom: calc(env(safe-area-inset-bottom) + 0px);
    width: 100vw;
    height: 100vh;
    background: var(--background);
    font: var(--body1);
    color: var(--on-background);
    display: grid;
    grid-template-columns: 3fr 1fr;
    overflow: hidden;
`;

const Snackbar = styled.div<StateProps>`
    position: fixed;
    z-index: 100;
    left: 0;
    bottom: 0;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
    width: 100%;
    min-height: 45px;
    background: var(--on-background);
    color: var(--on-secondary);
    padding: 12px 16px;
    border-radius: 5px;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    font-size: 13px;
    font-size: 1.3rem;
    line-height: 24px;
    line-height: 2.4rem;
    letter-spacing: 0.1px;
    letter-spacing: 0.01rem;
    font-weight: 400;
    text-transform: inherit;
    visibility: hidden;
    transform: translateY(100%);
    transition: 0.25s ease-in;

    @media ${Device.laptop} {
        width: auto;
        min-width: 344px;
        margin: 28px;
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            visibility: visible;
            transform: translateY(0%);
            transition: 0.3s ease-out;
        `};
`;

const App = function () {
    const nodeRef = React.useRef(null);
    const [user, setUser] = useState(null);
    const [snackbar, setSnackbar] = useState("");
    const [darkTheme, setDarkTheme] = useState(false);
    const [fabricantes, setFabricantes] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
            },
        ],
    });
    const [modelos, setModelos] = useState({
        total: 0,
        limit: 0,
        skip: 0,
        data: [
            {
                id: 0,
                nombre: "",
                createdAt: "",
                updatedAt: "",
                fabricanteId: 0,
            },
        ],
    });

    function loadCars() {
        feathersClient
            .service("api/fabricantes")
            .find({
                query: {
                    $limit: 100,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((fabricantes) => {
                setFabricantes(fabricantes);
                feathersClient
                    .service("api/modelos")
                    .find({
                        query: {
                            $limit: 200,
                            $sort: {
                                nombre: 1,
                            },
                        },
                    })
                    .then((modelos) => {
                        setModelos(modelos);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        setDarkTheme(false);
        feathersClient
            .reAuthenticate()
            .then(({ user }) => setUser(user))
            .catch((error) => {
                console.error(error);
                setUser(null);
            });
    }, []);

    useEffect(() => {
        loadCars();
    }, [user]);

    useEffect(() => {
        if (snackbar !== "") {
            setTimeout(function () {
                setSnackbar("");
            }, 5500);
        }
    }, [snackbar]);

    const matchModelo = (modeloId) => {
        try {
            return `
                ${
                    fabricantes.data.find(
                        ({ id }) =>
                            id ===
                            modelos.data.find(({ id }) => id === modeloId)!
                                .fabricanteId
                    )!.nombre
                } ${modelos.data.find(({ id }) => id === modeloId)!.nombre}
            `;
        } catch {
            return "error";
        }
    };

    return (
        <>
            <ThemeProvider theme={darkTheme ? themeDark : themeLight}>
                <GlobalStyle />
            </ThemeProvider>
            {user ? (
                <Main>
                    <Gestion
                        setSnackbar={setSnackbar}
                        matchModelo={matchModelo}
                    />
                    <Turnos
                        setSnackbar={setSnackbar}
                        matchModelo={matchModelo}
                    />
                    <Transition
                        nodeRef={nodeRef}
                        in={snackbar !== ""}
                        addEndListener={(nodeRef, done) => {
                            nodeRef.addEventListener(
                                "transitionend",
                                done,
                                false
                            );
                        }}
                    >
                        {(state) => (
                            <Snackbar state={state}>{snackbar}</Snackbar>
                        )}
                    </Transition>
                </Main>
            ) : (
                <Login setUser={setUser} />
            )}
        </>
    );
};

export default App;
