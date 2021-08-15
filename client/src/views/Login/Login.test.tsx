import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

test("renders learn react link", () => {
    const { getByText, getByLabelText } = render(<Login />);
    getByLabelText("Usuario");
    getByLabelText("Contraseña");
    getByText("Ingresar");
});
