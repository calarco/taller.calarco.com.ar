import { DefaultTheme } from "styled-components";

const themeLight: DefaultTheme = {
    shadows: {
        surface:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.079), 0 1.6px 2.5px rgba(0, 0, 0, 0.059), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px rgba(255, 255, 255, 0.5)",
        surfaceVariant:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.05), 0 1.6px 2.5px rgba(0, 0, 0, 0.03), 5px 7px 11px rgba(0, 0, 0, 0.01), -5px -5px 10px rgba(255, 255, 255, 0.3)",
    },

    borders: {
        border: "1px solid rgba(0, 0, 0, 0.2)",
        borderVariant: "1px solid rgba(0, 0, 0, 0.1)",
        borderPrimary: "1px solid rgba(80, 152, 206, 0.3)",
    },

    colors: {
        background: "#CFD8DC",
        surface: "rgba(255, 255, 255, 1)",
        surfaceT: "rgba(255, 255, 255, 0.7)",
        surfaceVariant: "#e3e8eb",
        primary: "rgba(66, 121, 152, 1)",
        primaryVariant: "rgba(66, 121, 152, 0.2)",
        secondary: "rgba(192, 128, 102, 1)",
        secondaryVariant: "rgba(192, 128, 102, 0.2)",
        onBackground: "rgba(0, 0, 0, 0.9)",
        onBackgroundVariant: "rgba(0, 0, 0, 0.5)",
        onBackgroundDisabled: "rgba(0, 0, 0, 0.3)",
        error: "rgba(236, 71, 88, 1)",
        errorVariant: "#ef948f",
        overlay: "rgba(236, 239, 241, 0.7)",
    },
};

const themeDark: DefaultTheme = {
    shadows: {
        surface:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.079), 0 1.6px 2.5px rgba(0, 0, 0, 0.059), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px rgba(255, 255, 255, 0)",
        surfaceVariant:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.079), 0 1.6px 2.5px rgba(0, 0, 0, 0.059), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px rgba(255, 255, 255, 0)",
    },

    borders: {
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderVariant: "1px solid hsla(17, 42%, 68%, 0.1)",
        borderPrimary: "1px solid hsla(202, 39%, 53%, 0.3)",
    },

    colors: {
        background: "#010101",
        surface: "hsla(202, 10%, 12%, 1)",
        surfaceT: "hsla(202, 10%, 14%, 0.7)",
        surfaceVariant: "hsla(202, 10%, 8%, 1)",
        primary: "hsla(202, 39%, 53%, 1)",
        primaryVariant: "hsla(202, 39%, 53%, 0.1)",
        secondary: "hsla(17, 42%, 68%, 1)",
        secondaryVariant: "hsla(17, 42%, 68%, 0.1)",
        onBackground: "rgba(255, 255, 255, 0.87)",
        onBackgroundVariant: "rgba(255, 255, 255, 0.6)",
        onBackgroundDisabled: "rgba(255, 255, 255, 0.038)",
        error: "rgba(236, 71, 88, 1)",
        errorVariant: "#f45104",
        overlay: "hsla(202, 10%, 6%, 0.7)",
    },
};

export { themeDark, themeLight };
