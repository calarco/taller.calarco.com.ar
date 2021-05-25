import React, { useState } from "react";
import feathersClient from "feathersClient";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";
import { Device } from "components/globalStyle";
import { Button, DialogButtons } from "components/components";
import { Dialog } from "components/dialogs";

type MenuProps = {
    readonly state?: string;
};

const Overlay = styled.div<MenuProps>`
    position: fixed;
    z-index: 6;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: var(--overlay);
    opacity: 0;
    visibility: hidden;
    transition: 0.3s ease-in-out;

    ${(props) =>
        props.state === "entered" &&
        css`
            opacity: 0.8;
            visibility: visible;
        `};
`;

const Left = styled.nav<MenuProps>`
    position: fixed;
    z-index: 7;
    height: auto;
    width: 100%;
    border-radius: 20px 20px 0 0;
    display: grid;
    justify-items: start;
    grid-template-rows: auto 1fr auto;
    visibility: hidden;
    opacity: 0;
    left: 0;
    bottom: -100%;
    transition: 0.25s ease-in;
    overflow-x: hidden;

    @media ${Device.laptop} {
        border-radius: 0;
        position: fixed;
        bottom: 0;
        grid-row-end: span 2;
        visibility: visible;
        opacity: 1;
        box-shadow: none;
        height: 100vh;
        max-width: 64px;
    }

    @media ${Device.desktop} {
        position: static;
        max-width: 256px;
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            visibility: visible;
            opacity: 1;
            left: 0;
            bottom: 0;
            transition: 0.3s ease-out;
            background: var(--surface);
            box-shadow: 0 -3.7px 5.3px rgba(0, 0, 0, 0.028),
                0 -12.5px 17.9px rgba(0, 0, 0, 0.042),
                0 -56px 80px rgba(0, 0, 0, 0.07);

            @media ${Device.laptop} {
                left: 0;
                bottom: 0;
                max-width: 256px;
                box-shadow: 6.7px 0 5.3px rgba(0, 0, 0, 0.028),
                    22.3px 0 17.9px rgba(0, 0, 0, 0.042),
                    100px 0 80px rgba(0, 0, 0, 0.07);
            }
        `};
`;

const Top = styled.div`
    width: 100%;
    min-width: 256px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const MenuButton = styled(Button)<MenuProps>`
    width: 12px;
    padding: 0;
    visibility: hidden;
    transition: 0.05s ease-in;
    opacity: 0;
    transform: rotate(90deg);

    ${(props) =>
        props.state === "entered" &&
        css`
            opacity: 1;
            transform: rotate(0deg);
            transition: 0.05s ease-out;
        `};

    @media ${Device.laptop} {
        visibility: visible;
        width: auto;
        padding: 15px;
    }

    @media ${Device.desktop} {
        visibility: hidden;
        width: 12px;
        padding: 0;
    }
`;

const User = styled.div`
    padding: 12px 0px;
    flex-grow: 1;
`;

const Name = styled.div`
    padding: 0 4px;
    font-size: 13px;
    font-size: 1.3rem;
    line-height: 24px;
    line-height: 2.4rem;
    letter-spacing: 0.1px;
    letter-spacing: 0.01rem;
    font-weight: 400;
    text-transform: inherit;
`;

const Mail = styled.div`
    padding: 0 4px;
    font-size: 12px;
    font-size: 1.2rem;
    line-height: 20px;
    line-height: 2rem;
    letter-spacing: 0.2px;
    letter-spacing: 0.02rem;
    font-weight: 300;
    color: var(--on-background-variant);
    text-transform: uppercase;
`;

const Links = styled.div`
    width: 100%;
`;

const activeClassName = "nav-item-active";

const Link = styled(NavLink).attrs({
    activeClassName,
})`
    display: block;
    margin: 4px 0px;
    text-decoration: none;
    font-size: 14px;
    font-size: 1.4rem;
    line-height: 20px;
    line-height: 2rem;
    letter-spacing: 0.1px;
    letter-spacing: 0.01rem;
    font-weight: 500;
    color: var(--on-background-variant);
    transition: 0.1s ease-in-out;

    &:hover {
        cursor: pointer;
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
    }

    i {
        padding: 12px 20px;
    }

    &.${activeClassName} {
        color: var(--primary-variant);

        i {
            color: inherit;
        }
    }
`;

const Bottom = styled.div`
    width: 100%;
    padding: 20px;
    text-align: center;
    color: var(--on-background-variant);
`;

const Menu = function ({
    user,
    setUser,
    menuOpen,
    setMenuOpen,
    darkTheme,
    setDarkTheme,
}) {
    const nodeRef = React.useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Transition
                nodeRef={nodeRef}
                in={menuOpen}
                addEndListener={(nodeRef, done) => {
                    nodeRef.addEventListener("transitionend", done, false);
                }}
            >
                {(state) => (
                    <>
                        <Overlay
                            state={state}
                            onClick={() => {
                                setMenuOpen(false);
                            }}
                        />
                        <Left state={state}>
                            <Top>
                                <SwitchTransition mode="out-in">
                                    <Transition
                                        nodeRef={nodeRef}
                                        key={menuOpen ? "bar" : "foo"}
                                        addEndListener={(nodeRef, done) => {
                                            nodeRef.addEventListener(
                                                "transitionend",
                                                done,
                                                false
                                            );
                                        }}
                                        unmountOnExit
                                        mountOnEnter
                                    >
                                        {(statem) => (
                                            <>
                                                {menuOpen ? (
                                                    <MenuButton
                                                        icon
                                                        type="button"
                                                        onClick={() => {
                                                            setMenuOpen(false);
                                                        }}
                                                        state={statem}
                                                    >
                                                        <i className="material-icons md-24">
                                                            arrow_back
                                                        </i>
                                                    </MenuButton>
                                                ) : (
                                                    <MenuButton
                                                        icon
                                                        type="button"
                                                        onClick={() => {
                                                            setMenuOpen(true);
                                                        }}
                                                        state={statem}
                                                    >
                                                        <i className="material-icons md-24">
                                                            menu
                                                        </i>
                                                    </MenuButton>
                                                )}
                                            </>
                                        )}
                                    </Transition>
                                </SwitchTransition>
                                <User>
                                    <Name>Sebastián Calarco</Name>
                                    <Mail>{user.email}</Mail>
                                </User>
                                <Button
                                    icon
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setModalOpen(!modalOpen);
                                    }}
                                >
                                    <i className="material-icons md-18">
                                        exit_to_app
                                    </i>
                                </Button>
                            </Top>
                            <Links>
                                <Link
                                    exact
                                    to="/"
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}
                                >
                                    <i className="material-icons md-24">
                                        build
                                    </i>
                                    Gestion
                                </Link>
                                <Link
                                    to="/turnos"
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}
                                >
                                    <i className="material-icons md-24">
                                        event_note
                                    </i>
                                    Turnos
                                </Link>
                                <Link
                                    to="/presupuestos"
                                    onClick={() => {
                                        setMenuOpen(false);
                                    }}
                                >
                                    <i className="material-icons md-24">poll</i>
                                    Presupuestos
                                </Link>
                            </Links>
                            <Bottom>
                                <SwitchTransition mode="out-in">
                                    <Transition
                                        nodeRef={nodeRef}
                                        key={darkTheme ? "bar" : "foo"}
                                        addEndListener={(nodeRef, done) => {
                                            nodeRef.addEventListener(
                                                "transitionend",
                                                done,
                                                false
                                            );
                                        }}
                                        unmountOnExit
                                        mountOnEnter
                                    >
                                        {(statem) => (
                                            <>
                                                {darkTheme ? (
                                                    <Button
                                                        icon
                                                        type="button"
                                                        onClick={() => {
                                                            setDarkTheme(
                                                                !darkTheme
                                                            );
                                                        }}
                                                        state={statem}
                                                    >
                                                        <i className="material-icons md-24">
                                                            brightness_7
                                                        </i>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        icon
                                                        type="button"
                                                        onClick={() => {
                                                            setDarkTheme(
                                                                !darkTheme
                                                            );
                                                        }}
                                                        state={statem}
                                                    >
                                                        <i className="material-icons md-24">
                                                            brightness_4
                                                        </i>
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </Transition>
                                </SwitchTransition>
                                <footer>CalarcoWEB © 2020</footer>
                            </Bottom>
                        </Left>
                    </>
                )}
            </Transition>
            <Dialog
                nodeRef={nodeRef}
                isActive={modalOpen}
                handleClose={() => setModalOpen(false)}
            >
                <p>¿Cerrar sesión?</p>
                <DialogButtons>
                    <Button
                        type="button"
                        onClick={() => {
                            setModalOpen(false);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        red
                        type="button"
                        onClick={() => {
                            feathersClient.logout();
                            setUser(null);
                        }}
                    >
                        Salir
                    </Button>
                </DialogButtons>
            </Dialog>
        </>
    );
};

export default Menu;
