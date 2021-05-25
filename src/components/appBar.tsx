import styled, { css } from "styled-components";
import { Device } from "components/globalStyle";

type StateProps = {
    readonly state?: string;
};

export const AppBar = styled.div`
    position: sticky;
    bottom: 0;
    z-index: 5;
    grid-column-start: 2;
    grid-row-start: 2;
    padding: 0 8px;
    width: 100%;
    background: var(--surface);
    box-shadow: var(--shadow0);
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: center;

    @media ${Device.laptop} {
        position: fixed;
        background: none;
        box-shadow: none;
    }
`;

export const Left = styled.div`
    justify-self: start;

    @media ${Device.laptop} {
        visibility: hidden;
    }
`;

export const Fab = styled.button<StateProps>`
    position: absolute;
    z-index: 2;
    top: -50%;
    padding: 15px;
    border-radius: 100%;
    background: var(--secondary);
    color: var(--on-secondary);
    box-shadow: var(--shadow0);
    opacity: 0;
    transform: scale(0.9);
    transition: 0.15s ease-in;

    &:hover {
        background-color: var(--secondary-variant);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
    }

    ${(props) =>
        props.state === "entered" &&
        css`
            opacity: 1;
            transform: scale(1);
            transition: 0.2s ease-out;
        `};
`;

export const Right = styled.div`
    justify-self: end;

    @media ${Device.laptop} {
        visibility: hidden;
    }
`;
