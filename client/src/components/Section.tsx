import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly overlay?: boolean;
    readonly state?: string;
};

const Container = styled.section<Props>`
    content-visibility: auto;
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
    transition: 0.3s ease-out;

    ${(props) =>
        props.state &&
        props.state !== "entered" &&
        css`
            visibility: hidden;
            opacity: 0;
            transform: translateY(0.75rem);
            transition: 0.3s ease-in;
        `};

    ${(props) =>
        props.overlay &&
        css`
            overflow: hidden;
            background: var(--surface-variant);
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
    background: rgba(236, 239, 241, 0.7);
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
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    state?: string;
    children: React.ReactNode;
    className?: string;
};

const Section = function ({
    overlay,
    onClick,
    state,
    children,
    className,
}: ComponentProps) {
    return (
        <Container overlay={overlay} state={state} className={className}>
            {children}
            <Overlay overlay={overlay} onClick={onClick} />
        </Container>
    );
};

export default Section;
