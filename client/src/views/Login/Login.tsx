import React, { useState } from "react";
import styled, { css } from "styled-components";
import feathersClient from "feathersClient";

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

type LoadingProps = {
    readonly loading?: boolean;
};

const Container = styled.div<LoadingProps>`
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    opacity: 1;
    transition: 0.2s ease-out;

    ${(props) =>
        props.loading &&
        css`
            opacity: 0;
            transition: 0.3s ease-in;
        `};
`;

const Form = styled.form`
    padding: 48px 36px;
    border-radius: 6px;
    background: var(--surface);
    box-shadow: var(--shadow);
    display: grid;
    justify-items: center;
    align-items: center;
`;

const Buttons = styled.div`
    padding: 40px 0 0 0;
`;

const Login = function ({ setUser }) {
    const [inputs, setInputs] = useState({
        user: "test",
        password: "1234",
        loading: false,
        error: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setInputs({ ...inputs, loading: true });
        feathersClient
            .authenticate({
                strategy: "local",
                email: inputs.user,
                password: inputs.password,
            })
            .then(({ user }) => setUser(user))
            .catch((error) => {
                console.error(error);
                setInputs({
                    ...inputs,
                    password: "",
                    loading: false,
                    error: error,
                });
            });
    };

    const handleInputChange = (event) => {
        event.persist();
        setInputs((inputs) => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <FormItem>
                    <p>Usuario</p>
                    <input
                        type="text"
                        name="user"
                        value={inputs.user}
                        onChange={handleInputChange}
                        autoComplete="username"
                    />
                </FormItem>
                <FormItem>
                    <p>Contraseña</p>
                    <input
                        type="password"
                        name="password"
                        value={inputs.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                    />
                </FormItem>
                <Buttons>
                    {inputs.loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div>{inputs.error}</div>
                            <Button
                                solid
                                type="submit"
                                disabled={inputs.loading ? true : false}
                            >
                                Ingresar
                            </Button>
                        </>
                    )}
                </Buttons>
            </Form>
        </Container>
    );
};

export default Login;
