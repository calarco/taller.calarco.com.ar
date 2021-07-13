import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import feathersClient from "feathersClient";

import { themeDark, themeLight } from "themes";
import GlobalStyle, { Device } from "components/globalStyle";
import Login from "views/Login/Login";
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
    grid-template-columns: 0px 3fr;
    grid-template-areas: "gestion gestion";
    overflow: hidden;

    @media ${Device.desktop} {
        grid-template-columns: 1fr 3fr;
    }
`;

const App = function () {
    const [user, setUser] = useState(null);
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
            .service("fabricantes")
            .find({
                query: {
                    $limit: 100,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found) => {
                found.data[0] && setFabricantes(found);
            })
            .catch((error) => {
                console.error(error);
            });
        feathersClient
            .service("modelos")
            .find({
                query: {
                    $limit: 200,
                    $sort: {
                        nombre: 1,
                    },
                },
            })
            .then((found) => {
                found.data[0] && setModelos(found);
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

    const matchModelo = (modeloId) => {
        try {
            return (
                fabricantes.data.find(
                    ({ id }) =>
                        id ===
                        modelos.data.find(({ id }) => id === modeloId)!
                            .fabricanteId
                )!.nombre +
                " " +
                modelos.data.find(({ id }) => id === modeloId)!.nombre
            );
        } catch {
            return "error";
        }
    };

    return (
        <>
            <ThemeProvider theme={darkTheme ? themeDark : themeLight}>
                <GlobalStyle />
            </ThemeProvider>
            <Main>
                {user ? (
                    <Gestion matchModelo={matchModelo} />
                ) : (
                    <Login setUser={setUser} />
                )}
            </Main>
        </>
    );
};

export default App;
