import { DefaultTheme } from "styled-components";

const themeLight: DefaultTheme = {
    shadow0:
        "0 0.5px 0.7px rgba(0, 0, 0, 0.1), 0 1.6px 2.5px rgba(0, 0, 0, 0.179), 5px 7px 11px rgba(0, 0, 0, 0.121), -5px -5px 10px #ffffff",

    colors: {
        primary: "#5098ce",
        primaryVariant: "#819ca9",
        secondary: "#9d448e",
        secondaryVariant: "rgba(157, 67, 141, 0.6)",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        borderVariant: "1px solid rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(0deg, rgba(223,223,223,1) 0%, rgba(241,241,241,1) 100%)",
        onBackground: "rgba(0, 0, 0, 0.87)",
        onBackgroundVariant: "rgba(0, 0, 0, 0.6)",
        onBackgroundDisabled: "rgba(0, 0, 0, 0.038)",
        surface: "#fff",
        error: "#e73e37",
        overlay: "rgba(160, 160, 160, 0.1)",
    },
};

const themeDark: DefaultTheme = {
    shadow0:
        "0 0.5px 0.7px rgba(0, 0, 0, 0.3), 0 1.6px 2.5px rgba(0, 0, 0, 0.179), 0 7px 11px rgba(0, 0, 0, 0.121)",

    colors: {
        primary: "#546e7a",
        primaryVariant: "#819ca9",
        secondary: "#fbc02d",
        secondaryVariant: "#fff263",
        border: "1px solid rgba(0, 0, 0, 0.3)",
        borderVariant: "1px solid rgba(0, 0, 0, 0.1)",
        background: "#121212",
        onBackground: "rgba(255, 255, 255, 0.87)",
        onBackgroundVariant: "rgba(255, 255, 255, 0.6)",
        onBackgroundDisabled: "rgba(255, 255, 255, 0.038)",
        surface: "#1E1E1E",
        error: "#cf6679",
        overlay: "rgba(18, 18, 18, 0.8)",
    },
};

export { themeDark, themeLight };
