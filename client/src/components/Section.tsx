import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly type?: string;
    readonly overlay?: boolean;
    readonly state?: string;
};

const Container = styled.section<Props>`
    content-visibility: auto;
    visibility: hidden;
    opacity: 0;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    padding: 1.5rem;
    overflow-y: overlay;
    border-radius: 0 0 4px 4px;
    background: var(--surface-variant);
    border: var(--border-variant);
    border-top: none;
    box-shadow: var(--shadow-variant);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: 0.3s ease-out;

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
            border: var(--border-variant);
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        !props.overlay &&
        css`
            background: var(--surface);
            border: var(--border);
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
    content-visibility: auto;
    will-change: opacity;
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
            height: 1000%;
            opacity: 1;
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
