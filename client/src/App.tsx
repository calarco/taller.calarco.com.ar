import React, { useState, useEffect } from "react";
import feathersClient from "feathersClient";
import { ThemeProvider } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

import { themeDark, themeLight } from "themes";
import GlobalStyle from "components/globalStyle";
import Login from "views/Login/Login";
import { GestionProvider } from "views/Gestion/context";
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
`;

const App = function () {
    const [user, setUser] = useState(null);
    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => {
        feathersClient
            .reAuthenticate()
            .then(({ user }) => setUser(user))
            .catch((error) => {
                console.error(error);
                setUser(null);
            });
    }, []);

    return (
        <>
            <ThemeProvider theme={darkTheme ? themeDark : themeLight}>
                <GlobalStyle />
            </ThemeProvider>
            <SwitchTransition>
                <Main key={user ? "0" : "1"}>
                    {user ? (
                        <GestionProvider>
                            <Gestion
                                setUser={setUser}
                                darkTheme={darkTheme}
                                setDarkTheme={setDarkTheme}
                            />
                        </GestionProvider>
                    ) : (
                        <Login setUser={setUser} />
                    )}
                </Main>
            </SwitchTransition>
        </>
    );
};

export default App;
