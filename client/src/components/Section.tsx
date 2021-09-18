import React from "react";
import styled, { css } from "styled-components";

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
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
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
    children: React.ReactNode;
    className?: string;
};

const Section = function ({
    overlay,
    onClick,
    children,
    className,
}: ComponentProps) {
    return (
        <Container overlay={overlay} className={className}>
            {children}
            <Overlay overlay={overlay} onClick={onClick} />
        </Container>
    );
};

export default Section;
