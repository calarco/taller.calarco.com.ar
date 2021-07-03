import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly type?: string;
    readonly active?: boolean;
    readonly state?: string;
};

const Container = styled.section<Props>`
    visibility: hidden;
    opacity: 0;
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 1.5rem;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: 5s ease-out;

    ${(props) =>
        props.active &&
        css`
            overflow: hidden;
            transition: none;
        `};

    ${(props) =>
        props.type === "vehiculos" &&
        css`
            min-height: 25rem;
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        css`
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 2;
            grid-row-end: 2;
            border-radius: 4px;
            border-top: var(--border-variant);
        `};

    ${(props) =>
        props.type === "reparaciones" &&
        !props.active &&
        css`
            min-height: 21.5rem;
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
        props.active &&
        css`
            visibility: visible;
            opacity: 1;
            height: 1000%;
            transform: initial;
            transition: 0.3s ease-out;
        `};
`;

const Section = function ({
    activeSection,
    setActiveSection,
    type,
    state,
    children,
}) {
    const [overlay, setOverlay] = useState(false);

    useEffect(() => {
        (type === "vehiculos" &&
            (activeSection === "Vehículo" || activeSection === "Cliente")) ||
        (type === "reparaciones" && activeSection !== "")
            ? setOverlay(true)
            : setOverlay(false);
    }, [type, activeSection]);

    return (
        <Container type={type} active={overlay} state={state}>
            {children}
            <Overlay
                active={overlay}
                onClick={() => {
                    setActiveSection("");
                }}
            />
        </Container>
    );
};

export default Section;
