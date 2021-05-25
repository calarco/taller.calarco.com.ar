import React from "react";
import { Transition } from "react-transition-group";
import styled, { css } from "styled-components";
import { Device } from "components/globalStyle";

const Overlay = styled.div<ShowProps>`
    position: fixed;
    z-index: 40;
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
            opacity: 1;
            visibility: visible;
        `};
`;

const Container = styled.div<ShowProps>`
    position: fixed;
    z-index: 41;
    inset: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;

    @media ${Device.laptop} {
        padding: 60px;
    }
`;

const DialogWindow = styled.div<ShowProps>`
    min-width: 280px;
    border-radius: 6px;
    background: var(--surface);
    overflow: auto;
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.056),
        0 6.7px 5.3px rgba(0, 0, 0, 0.081), 0 12.5px 10px rgba(0, 0, 0, 0.1),
        0 22.3px 17.9px rgba(0, 0, 0, 0.119),
        0 41.8px 33.4px rgba(0, 0, 0, 0.144), 0 100px 80px rgba(0, 0, 0, 0.2);
    opacity: 0;
    visibility: hidden;
    transform: scale(1.1);
    transition: 0.2s ease-in;
    pointer-events: all;

    & > p {
        margin: 0;
        padding: 20px 24px 0 24px;
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            opacity: 1;
            visibility: visible;
            transform: scale(1);
            transition: 0.25s ease-out;
        `};
`;

const FullDialogWindow = styled(DialogWindow)`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: auto;
    transform: translateY(70%) scale(0.9);

    @media ${Device.laptop} {
        position: static;
        width: auto;
        max-width: 600px;
        height: auto;
        max-height: 100%;
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            transform: translateY(0) scale(1);
        `};
`;

export const Dialog = ({ nodeRef, children, isActive, handleClose }) => (
    <Transition
        nodeRef={nodeRef}
        in={isActive}
        addEndListener={(nodeRef, done) => {
            nodeRef.addEventListener("transitionend", done, false);
        }}
    >
        {(state) => (
            <>
                <Overlay
                    state={state}
                    onClick={() => {
                        handleClose();
                    }}
                />
                <Container>
                    <DialogWindow state={state}>{children}</DialogWindow>
                </Container>
            </>
        )}
    </Transition>
);

export const FullDialog = ({ nodeRef, children, isActive, handleClose }) => (
    <Transition
        nodeRef={nodeRef}
        in={isActive}
        addEndListener={(nodeRef, done) => {
            nodeRef.addEventListener("transitionend", done, false);
        }}
    >
        {(state) => (
            <>
                <Overlay
                    state={state}
                    onClick={() => {
                        handleClose();
                    }}
                />
                <Container>
                    <FullDialogWindow state={state}>
                        {children}
                    </FullDialogWindow>
                </Container>
            </>
        )}
    </Transition>
);

type ShowProps = {
    readonly state?: string;
    readonly full?: boolean;
};
