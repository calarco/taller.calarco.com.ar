import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly overlay?: boolean;
    readonly state?: string;
};

const Container = styled.section<Props>`
    content-visibility: auto;
    visibility: visible;
    opacity: 1;
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
            transition: 0.3s ease-in;
        `};

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

type ComponentProps = {
    active: boolean;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    state?: string;
    children: React.ReactNode;
    className?: string;
};

const Section = function ({
    active,
    onClick,
    state,
    children,
    className,
}: ComponentProps) {
    return (
        <Container overlay={!active} state={state} className={className}>
            {children}
            <Overlay overlay={!active} onClick={onClick} />
        </Container>
    );
};

export default Section;
