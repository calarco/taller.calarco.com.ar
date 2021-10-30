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
        background: "hsla(202, 15%, 80%, 1)",
        surface: "hsla(202, 15%, 100%, 1)",
        surfaceT: "hsla(202, 15%, 100%, 0.7)",
        surfaceVariant: "hsla(202, 15%, 90%, 1)",
        primary: "hsla(202, 39%, 43%, 1)",
        primaryVariant: "hsla(202, 49%, 43%, 0.2)",
        secondary: "hsla(17, 42%, 58%, 1)",
        secondaryVariant: "hsla(17, 42%, 58%, 0.2)",
        onBackground: "hsla(17, 0%, 0%, 0.9)",
        onBackgroundVariant: "hsla(17, 0%, 0%, 0.5)",
        onBackgroundDisabled: "hsla(17, 0%, 0%, 0.3)",
        error: "hsla(354, 50%, 60%, 1)",
        errorVariant: "hsla(354, 80%, 60%, 0.2)",
        overlay: "hsla(202, 15%, 90%, 0.6)",
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
        background: "hsla(202, 10%, 5%, 1)",
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
        error: "hsla(354, 60%, 70%, 1)",
        errorVariant: "hsla(354, 90%, 70%, 0.2)",
        overlay: "hsla(202, 10%, 8%, 0.7)",
    },
};

export { themeDark, themeLight };
