import React from "react";
import styled, { css } from "styled-components";
import { Transition } from "react-transition-group";
import { Device } from "components/globalStyle";
import { Button } from "components/components";

type StateProps = {
    readonly state?: string;
};

const Overlay = styled.div<StateProps>`
    position: fixed;
    z-index: 3;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background: var(--background);
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

const TopBar = styled.div`
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    @media ${Device.laptop} {
        justify-content: flex-start;
    }

    span {
        padding: 18px 20px;
        font-size: 20px;
        font-size: 2rem;
        line-height: 28px;
        line-height: 2.8rem;
        letter-spacing: 0.05px;
        letter-spacing: 0.005rem;
        font-weight: 400;
        text-transform: inherit;

        @media ${Device.laptop} {
            padding-left: 40px;
        }
    }
`;

const Side = styled.aside<StateProps>`
    position: fixed;
    z-index: 4;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    visibility: hidden;
    opacity: 0;
    right: -100%;
    transition: 0.25s ease-in;

    @media ${Device.laptop} {
        visibility: visible;
        opacity: 1;
        position: static;
        grid-column-start: 3;
        grid-row-end: span 2;
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            visibility: visible;
            opacity: 1;
            right: 0;
            transition: 0.3s ease-out;
            background: var(--background);
            box-shadow: 0 -3.7px 5.3px rgba(0, 0, 0, 0.028),
                0 -12.5px 17.9px rgba(0, 0, 0, 0.042),
                0 -56px 80px rgba(0, 0, 0, 0.07);
        `};
`;

type DayProps = {
    readonly current?: boolean;
};

const DayTitle = styled.div<DayProps>`
    flex-grow: 1;
    position: relative;
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
    font-size: 15px;
    font-size: 1.5rem;
    line-height: 28px;
    line-height: 2.8rem;
    letter-spacing: 0.1px;
    letter-spacing: 0.01rem;
    font-weight: 400;
    text-transform: uppercase;
    color: var(--on-background-variant);
    transition: 0.1s ease-in-out;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    ${(props) =>
        props.current &&
        css`
            border-bottom: 2px solid var(--secondary);
            color: var(--secondary);
        `};
`;

const SideList = styled.div`
    display: flex;
    flex-direction: column;
`;

const SideItem = styled.div`
    width: 100%;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    font-size: 1.3rem;
    line-height: 24px;
    line-height: 2.4rem;
    letter-spacing: 0.1px;
    letter-spacing: 0.01rem;
    font-weight: 400;
    text-transform: inherit;

    span {
        display: inline-block;
        color: var(--on-background-variant);
    }
`;

const AppointmentsSide = function ({ sideOpen, setSideOpen, turnos }) {
    const nodeRef = React.useRef(null);

    return (
        <>
            <Transition
                nodeRef={nodeRef}
                in={sideOpen}
                addEndListener={(nodeRef, done) => {
                    nodeRef.addEventListener("transitionend", done, false);
                }}
            >
                {(state) => (
                    <>
                        <Overlay
                            state={state}
                            onClick={() => {
                                setSideOpen(false);
                            }}
                        />
                        <Side state={state}>
                            <Button
                                icon
                                type="button"
                                onClick={() => {
                                    setSideOpen(false);
                                }}
                                state={state}
                            >
                                <i className="material-icons md-24">
                                    arrow_back
                                </i>
                            </Button>
                            <SideList>
                                <TopBar>
                                    <DayTitle current>Martes</DayTitle>
                                    <DayTitle>Miercoles</DayTitle>
                                    <DayTitle>Jueves</DayTitle>
                                </TopBar>
                                {turnos.data.map((aTurno) => (
                                    <SideItem>
                                        <b>{aTurno.paciente}</b>
                                        <span>{aTurno.hora}</span>
                                    </SideItem>
                                ))}
                            </SideList>
                        </Side>
                    </>
                )}
            </Transition>
        </>
    );
};

export default AppointmentsSide;
