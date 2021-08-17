import React, { useState } from "react";
import styled from "styled-components";
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

const Container = styled.div`
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    opacity: 1;
    transition: 0.2s ease-out;
`;

const Form = styled.form`
    position: relative;
    border-radius: 4px;
    border: 1px solid var(--primary);
    box-shadow: var(--shadow);
    background: var(--primary);
    display: grid;
    gap: 1px;
    align-items: start;

    label {
        height: 100%;
        padding: 0.5rem 1rem;
        background: var(--surface);
    }

    label:first-child {
        border-radius: 4px 4px 0 0;
    }
`;

const Buttons = styled.div`
    width: 100%;
    height: 3rem;
    border-radius: 0 0 4px 4px;
    overflow: hidden;
    background: var(--surface);
    display: flex;
    transition: 0.25s ease-out;

    button {
        width: 100%;
        height: 3rem;
        margin: 0;
        padding: 0 1.5rem;
        border-radius: 0px;
        background: none;
        border: none;
    }
`;

const Error = styled.div`
    position: absolute;
    bottom: -3rem;
    height: 3rem;
    width: 100%;
    border-radius: 4px;
    box-shadow: var(--shadow-variant);
    background: var(--surface-variant);
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
                    error: error.message,
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
                <label>
                    Usuario
                    <input
                        type="text"
                        name="user"
                        value={inputs.user}
                        onChange={handleInputChange}
                        autoComplete="username"
                    />
                </label>
                <label>
                    Contraseña
                    <input
                        type="password"
                        name="password"
                        value={inputs.password}
                        onChange={handleInputChange}
                        autoComplete="current-password"
                    />
                </label>
                <Buttons>
                    {inputs.loading ? (
                        <Spinner />
                    ) : (
                        <button
                            type="submit"
                            disabled={inputs.loading ? true : false}
                        >
                            Ingresar
                        </button>
                    )}
                </Buttons>
                {inputs.error && <Error>{inputs.error}</Error>}
            </Form>
        </Container>
    );
};

export default Login;
