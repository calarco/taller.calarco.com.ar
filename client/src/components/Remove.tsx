import React, { MouseEvent } from "react";
import feathersClient from "feathersClient";
import styled, { css } from "styled-components";
import transition from "styled-transition-group";

type Props = {
    inline?: boolean;
};

const Container = transition.div.attrs({
    unmountOnExit: true,
    timeout: {
        enter: 200,
        exit: 150,
    },
})<Props>`
    position: absolute;
    z-index: 1001;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    min-height: 3rem;
    border-radius: 4px;
    overflow: hidden;
    background: var(--overlay);
    backdrop-filter: blur(0.5rem) saturate(0);
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-rows: 1fr auto;

    ${(props: Props) =>
        props.inline &&
        css`
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 0;
            outline: none;
            background: var(--primary-variant);
            box-shadow: var(--shadow-variant);
            grid-template-rows: 1fr;
            grid-template-columns: 1fr auto;
        `};

    h5 {
        padding: 0.5rem;
    }

    &:enter {
        opacity: 0;
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

const Buttons = styled.div<Props>`
    position: relative;
    width: 100%;
    height: 3rem;
    overflow: hidden;
    border-top: 1px solid var(--primary-variant);
    display: flex;
    transition: 0.25s ease-out;

    ${(props) =>
        props.inline &&
        css`
            height: 100%;
            border-top: none;

            &::after {
                content: "";
                position: absolute;
                top: calc(50% - 1rem);
                left: 0;
                height: 2rem;
                border-left: 1px solid var(--primary-variant);
            }
        `};

    button {
        width: 100%;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;

        &:not(:first-child)::after {
            content: "";
            position: absolute;
            top: calc(50% - 1rem);
            left: 0;
            height: 2rem;
            border-left: 1px solid var(--primary-variant);
        }
    }
`;

type ComponentProps = {
    id: number;
    service: string;
    isActive: boolean;
    exit: (e: MouseEvent<HTMLButtonElement>) => void;
    inline?: boolean;
    className?: string;
};

const Remove = function ({
    id,
    service,
    isActive,
    exit,
    inline,
    className,
}: ComponentProps) {
    const handleDelete = () => {
        feathersClient
            .service(service)
            .remove(id)
            .then(() => {})
            .catch((error: FeathersErrorJSON) => {
                console.error(error);
            });
    };

    return (
        <Container in={isActive} className={className} inline={inline}>
            <h5>¿Borrar ?</h5>
            <Buttons inline={inline}>
                <button type="button" onClick={exit}>
                    Cancelar
                </button>
                <button type="reset" onClick={handleDelete}>
                    Borrar
                </button>
            </Buttons>
        </Container>
    );
};

export default Remove;
