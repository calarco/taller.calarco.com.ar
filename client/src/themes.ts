import { DefaultTheme } from "styled-components";

const themeLight: DefaultTheme = {
    shadows: {
        surface:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.079), 0 1.6px 2.5px rgba(0, 0, 0, 0.059), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px rgba(255, 255, 255, 0.6)",
        surfaceVariant:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.05), 0 1.6px 2.5px rgba(0, 0, 0, 0.03), 5px 7px 11px rgba(0, 0, 0, 0.01), -5px -5px 10px rgba(255, 255, 255, 0.3)",
    },

    colors: {
        primary: "#5098ce",
        primaryVariant: "rgba(80, 152, 206, 0.1)",
        secondary: "#9d448e",
        secondaryVariant: "rgba(157, 68, 142, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        borderVariant: "1px solid rgba(0, 0, 0, 0.1)",
        background: "#CFD8DC",
        onBackground: "rgba(0, 0, 0, 0.87)",
        onBackgroundVariant: "rgba(0, 0, 0, 0.6)",
        onBackgroundDisabled: "rgba(0, 0, 0, 0.038)",
        surface: "rgba(255, 255, 255, 1)",
        surfaceVariant: "#e3e8eb",
        error: "#ec4758",
        errorVariant: "#ef948f",
        overlay: "rgba(160, 160, 160, 0.1)",
    },
};

const themeDark: DefaultTheme = {
    shadows: {
        surface:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.079), 0 1.6px 2.5px rgba(0, 0, 0, 0.059), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px #ffffff",
        surfaceVariant:
            "0 0.5px 0.7px rgba(0, 0, 0, 0.079), 0 1.6px 2.5px rgba(0, 0, 0, 0.059), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px #ffffff",
    },

    colors: {
        primary: "#546e7a",
        primaryVariant: "#819ca9",
        secondary: "#fbc02d",
        secondaryVariant: "#fff263",
        border: "1px solid rgba(0, 0, 0, 0.3)",
        borderVariant: "1px solid rgba(0, 0, 0, 0.1)",
        background: "rgba(0, 0, 0, 0)",
        onBackground: "rgba(255, 255, 255, 0.87)",
        onBackgroundVariant: "rgba(255, 255, 255, 0.6)",
        onBackgroundDisabled: "rgba(255, 255, 255, 0.038)",
        surface: "rgba(255, 255, 255, 0.2)",
        surfaceVariant: "rgba(236, 239, 241, 0.7)",
        error: "#cf6679",
        errorVariant: "#f45104",
        overlay: "rgba(18, 18, 18, 0.8)",
    },
};

export { themeDark, themeLight };
