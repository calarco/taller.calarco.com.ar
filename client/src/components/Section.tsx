import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly type?: string;
    readonly overlay?: boolean;
    readonly state?: string;
};

const Container = styled.section<Props>`
    visibility: hidden;
    opacity: 0;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    padding: 1.5rem;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: 5s ease-out;

    ${(props) =>
        props.overlay &&
        css`
            overflow: hidden;
            transition: none;
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 2;
            grid-row-end: 2;
            min-height: 21.5rem;
            border-radius: 4px;
            border-top: var(--border-variant);
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        !props.overlay &&
        css`
            background: var(--surface);
            box-shadow: var(--shadow);
        `};

    ${(props) =>
        props.state === "entered" &&
        css`
            visibility: visible;
            opacity: 1;
            transform: initial;
            transition: 0.3s ease-in;
        `};
`;

const Overlay = styled.div<Props>`
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    background: var(--surface-variant);
    backdrop-filter: blur(0.5rem);
    transition: 0.25s ease-in;

    ${(props) =>
        props.overlay &&
        css`
            visibility: visible;
            opacity: 1;
            height: 1000%;
            transform: initial;
            transition: 0.3s ease-out;
        `};
`;

const Section = function ({ active, onClick, type, state, children }) {
    return (
        <Container type={type} overlay={!active} state={state}>
            {children}
            <Overlay overlay={!active} onClick={onClick} />
        </Container>
    );
};

export default Section;
