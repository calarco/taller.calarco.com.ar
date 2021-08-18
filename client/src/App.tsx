import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import { ThemeProvider } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { themeDark, themeLight } from "themes";
import GlobalStyle, { Device } from "components/globalStyle";
import Login from "views/Login/Login";
import { Gestion } from "views/Gestion";

const Main = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 300,
        exit: 200,
    },
})`
    will-change: opacity;
    padding-bottom: calc(env(safe-area-inset-bottom) + 0px);
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: grid;

    &:enter {
        opacity: 0;
        transform: scale(1.1);
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
        transform: scale(0.9);
        transition: 0.2s ease-in;
    }

    @media ${Device.desktop} {
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
            <SwitchTransition mode="out-in">
                <Main key={user ? "0" : "1"}>
                    {user ? (
                        <Gestion setUser={setUser} matchModelo={matchModelo} />
                    ) : (
                        <Login setUser={setUser} />
                    )}
                </Main>
            </SwitchTransition>
        </>
    );
};

export default App;
