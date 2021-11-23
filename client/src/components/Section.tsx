import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { useActive } from "Gestion/context/activeContext";

type Props = {
    overlay?: boolean;
};

const Container = styled.section<Props>`
    content-visibility: auto;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 25rem;
    max-height: 100%;
    padding: 1.5rem;
    border-radius: 4px;
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: 0.3s ease-out;

    ${(props) =>
        props.overlay &&
        css`
            overflow: hidden;
        `};
`;

const Overlay = styled.div<Props>`
    content-visibility: auto;
    will-change: opacity;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    z-index: 1001;
    top: 0;
    right: 0;
    left: 0;
    height: 100%;
    border-radius: 4px;
    background: var(--overlay);
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

type ComponentProps = {
    overlay: boolean;
    children: ReactNode;
    className?: string;
};

const Section = function ({ overlay, children, className }: ComponentProps) {
    const { setActiveCard } = useActive();

    return (
        <Container overlay={overlay} className={className}>
            {children}
            <Overlay
                overlay={overlay}
                onClick={() => {
                    setActiveCard("");
                }}
            />
        </Container>
    );
};

export default Section;
