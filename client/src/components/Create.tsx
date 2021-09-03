import React from "react";
import styled, { css } from "styled-components";

type Props = {
    readonly active?: boolean;
};

const Container = styled.div<Props>`
    position: sticky;
    top: 0;
    z-index: 500;
    height: 3rem;
    padding: 0 0 3rem 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(0.4rem);
    border: 1px solid var(--secondary);
    box-shadow: var(--shadow);
    transition: 0.25s ease-in;

    &:hover {
        cursor: pointer;
        border: 1px solid var(--secondary);
        transition: 0.2s ease-in;
    }

    ${(props) =>
        props.active &&
        css`
            z-index: 1500;
            box-shadow: none;
        `};
`;

const Buttons = styled.div`
    grid-row: 5;
    grid-column-start: 1;
    grid-column-end: span 3;
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    display: flex;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;
        border: none;

        &:not(:first-child)::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: var(--border);
        }
    }
`;

type ComponentProps = {
    type: string;
    active: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    className?: string;
};

const Create = function ({
    type,
    active,
    onClick,
    children,
    className,
}: ComponentProps) {
    return (
        <Container active={active} className={className}>
            {children}
            <Buttons>
                <button type="button" onClick={onClick}>
                    Crear {type}
                </button>
            </Buttons>
        </Container>
    );
};

export default Create;
