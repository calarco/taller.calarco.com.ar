import React, { useState } from "react";
import styled, { css } from "styled-components";
import feathersClient from "feathersClient";

import { Spinner, Button, FormItem } from "components/components";

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
    box-shadow: var(--shadow0);
    display: grid;
    justify-items: center;
    align-items: center;
`;

const Buttons = styled.div`
    padding: 40px 0 0 0;
`;

const Login = function ({ setUser }) {
    const [inputs, setInputs] = useState({
        user: "",
        password: "",
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
        <Container loading={inputs.loading}>
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
