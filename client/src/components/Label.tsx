import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";
import { SwitchTransition } from "react-transition-group";

type Props = {
    length?: number;
    error?: boolean;
};

const Container = styled.label<Props>`
    min-height: 5rem;
    padding: 0.5rem 1rem 0.75rem 1rem;
    background: var(--surface);
    display: grid;
    align-content: space-between;
    gap: 0.25rem;
    transition: 0.15s ease-in;

    ${(props) =>
        props.length &&
        css`
            grid-column-end: span ${props.length};
        `};

    ${(props) =>
        props.error &&
        css`
            font-weight: 500;
            color: var(--error);
            transition: 0.2s ease-out;

            input[type="text"],
            input[type="number"] {
                outline: 1px solid var(--error-variant);
            }
        `};
`;

const Span = transition.span.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})`
    font: inherit;
    color: inherit;
    margin: 0;

    &:enter {
        opacity: 0;
        transform: translateY(-1rem);
    }

    &:enter-active {
        opacity: 1;
        transform: initial;
        transition: 0.2s ease-out;
    }

    &:exit {
        opacity: 1;
    }

    &:exit-active {
        opacity: 0;
        transition: 0.15s ease-in;
    }
`;

type ComponentProps = {
    title: string;
    length?: number;
    error?: string;
    className?: string;
    children: ReactNode;
};

const Label = function ({
    title,
    length,
    error,
    className,
    children,
}: ComponentProps) {
    return (
        <Container
            error={error ? true : false}
            length={length}
            className={className}
        >
            <SwitchTransition>
                <Span key={error ? 0 : 1}>{error ? error : title}</Span>
            </SwitchTransition>
            {children}
        </Container>
    );
};

export default Label;
