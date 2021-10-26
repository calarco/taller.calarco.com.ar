import React, { MouseEvent, ReactNode } from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly active?: boolean;
    readonly variant?: boolean;
};

const Container = styled.div<Props>`
    position: sticky;
    top: 0;
    z-index: 500;
    height: 3rem;
    padding: 0 0 3rem 0;
    border-radius: 4px;
    background: var(--secondary-variant);
    backdrop-filter: blur(0.4rem);
    outline: 1px solid var(--secondary);
    box-shadow: var(--shadow);
    color: var(--secondary);
    transition: 0.25s ease-in;

    &:hover {
        cursor: pointer;
        transition: 0.2s ease-in;
    }

    ${(props) =>
        props.active &&
        css`
            z-index: 1500;
            box-shadow: none;
        `};

    ${(props) =>
        props.variant &&
        css`
            color: var(--primary);
        `};
`;

const Button = styled.button`
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    color: inherit;
    transition: 0.25s ease-out;
`;

type ComponentProps = {
    type: string;
    active: boolean;
    variant?: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    className?: string;
};

const Create = function ({
    type,
    active,
    variant,
    onClick,
    children,
    className,
}: ComponentProps) {
    return (
        <Container active={active} variant={variant} className={className}>
            {children}
            <Button type="button" onClick={onClick}>
                Crear {type}
            </Button>
        </Container>
    );
};

export default Create;
