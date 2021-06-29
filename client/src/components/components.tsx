import styled, { css } from "styled-components";

export const Spinner = styled.div`
    display: inline-block;
    vertical-align: middle;
    width: 40px;
    height: 40px;
    background-color: var(--on-background-variant);
    border-radius: 100%;
    -webkit-animation: sk-scaleout 1s infinite ease-in-out;
    animation: sk-scaleout 1s infinite ease-in-out;

    @keyframes sk-scaleout {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
            opacity: 0;
        }
    }
`;

type ButtonProps = {
    readonly outline?: boolean;
    readonly solid?: boolean;
    readonly red?: boolean;
    readonly icon?: boolean;
    readonly state?: string;
};

export const Button = styled.button<ButtonProps>`
    color: ${(props) =>
        props.icon
            ? "inherit"
            : props.red
            ? "var(--error)"
            : "var(--secondary)"};
    border: ${(props) =>
        props.outline
            ? "1px solid rgba(0, 0, 0, 0.2)"
            : "1px solid rgba(0, 0, 0, 0)"};

    ${(props) =>
        props.solid &&
        css`
            color: var(--on-secondary);
            background: var(--secondary);
            border: 1px solid rgba(196, 144, 0, 0.3);
            box-shadow: var(--shadow);

            &:hover {
                background-color: var(--secondary-variant);
                border: 1px solid var(--secondary-variant);
                box-shadow: 0 0.5px 0.7px rgba(129, 156, 169, 0.3),
                    0 1.6px 2.5px rgba(129, 156, 169, 0.179),
                    0 7px 11px rgba(129, 156, 169, 0.121);
            }
        `};

    ${(props) =>
        props.icon &&
        css`
            border-radius: 100%;
            padding: 15px;
        `};
`;

export const DialogButtons = styled.div`
    padding: 8px;
    text-align: right;
`;

type FormItemProps = {
    readonly half?: boolean;
    readonly third?: boolean;
    readonly twice?: boolean;
};

export const FormItem = styled.div<FormItemProps>`
    display: inline-block;
    vertical-align: top;
    width: ${(props) =>
        props.half
            ? "50%"
            : props.third
            ? "33%"
            : props.twice
            ? "66%"
            : "100%"};
    padding: 0 12px 12px 12px;

    p,
    span {
        margin: 0;
        padding: 10px;
    }

    b {
        display: block;
        padding: 10px 16px;
        font-size: 15px;
        font-size: 1.5rem;
        line-height: 28px;
        line-height: 2.8rem;
        letter-spacing: 0.1px;
        letter-spacing: 0.01rem;
        font-weight: 400;
        text-transform: inherit;
    }
`;
