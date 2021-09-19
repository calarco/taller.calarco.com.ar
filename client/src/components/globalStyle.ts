import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export const Device = {
    tablet: `(min-width: 768px)`,
    laptop: `(min-width: 1024px)`,
    desktop: `(min-width: 1440px)`,
};

const GlobalStyle = createGlobalStyle`
    ${normalize}

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: var(--overlay);
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.038);
        border: 1px solid rgba(0, 0, 0, 0.038);
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--on-background-variant);
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :root {
        -moz-tab-size: 4;
        tab-size: 4;
    }

    #root, html, body {
        height: 100vh;
    }

    html {
        font-size: 16px;
	    scroll-behavior: smooth;
    }
    
    body {
        --shadow: ${(props) => props.theme.shadows.surface};
        --shadow-variant: ${(props) => props.theme.shadows.surfaceVariant};

        --border: ${(props) => props.theme.borders.border};
        --border-variant: ${(props) => props.theme.borders.borderVariant};
        --border-primary: ${(props) => props.theme.borders.borderPrimary};

        --background: ${(props) => props.theme.colors.background};
        --surface: ${(props) => props.theme.colors.surface};
        --surface-t: ${(props) => props.theme.colors.surfaceT};
        --surface-variant: ${(props) => props.theme.colors.surfaceVariant};
        --primary: ${(props) => props.theme.colors.primary};
        --primary-variant: ${(props) => props.theme.colors.primaryVariant};
        --secondary: ${(props) => props.theme.colors.secondary};
        --secondary-variant: ${(props) => props.theme.colors.secondaryVariant};
        --on-background: ${(props) => props.theme.colors.onBackground};
        --on-background-variant: ${(props) =>
            props.theme.colors.onBackgroundVariant};
        --on-background-disabled: ${(props) =>
            props.theme.colors.onBackgroundDisabled};
        --error: ${(props) => props.theme.colors.error};
        --error-variant: ${(props) => props.theme.colors.errorVariant};
        --overlay: ${(props) => props.theme.colors.overlay};

        --font-family: "Supreme-Variable";
        --font-family-alt: "SpaceMono-Regular";

        --label: 300 0.75rem/1.25rem var(--font-family);
        --body1: 300 0.9rem/1.25rem var(--font-family);
        --body2: 500 0.9rem/1.5rem var(--font-family);
        --subhead1: 300 1rem/1.5rem var(--font-family);
        --subhead2: 500 1rem/1.75rem var(--font-family);
        --title: 500 1.25rem/1.75rem var(--font-family);
        --headline: 300 1.5rem/2rem var(--font-family);
        --display-1: 300 2rem/2.5rem var(--font-family);

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-feature-settings: "kern" 1;
        font-kerning: normal;
        font-family: var(--font-family), var(--font-family-alt), sans-serif;

        background: var(--background);
        color: var(--on-background);
        
        overflow: hidden;
        user-select: none;
    }

    pre,
    p,
    h6,
    h5,
    h4,
    h3,
    h2,
    h1,
    label {
        display: inline-block;
        margin: 0;
        color: var(--on-background);

        span, small {
            margin-left: 0.75em;
            color: var(--on-background-variant);
        }
    }

    p {
        font: var(--body1);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 1.25) * 0.5em);
        }

        small {
            font: var(--label);
        }
    }

    h6 {
        font: var(--body2);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 1.5) * 0.5em);
        }

        small {
            font: var(--body1);
        }

        span {
            font: var(--subhead1);
        }
    }

    h5 {
        font: var(--subhead1);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 1.5) * 0.5em);
        }

        small {
            font: var(--body1);
        }
    }

    h4 {
        font: var(--subhead2);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 2.25) * 0.5em);
        }

        small {
            font: var(--body1);
        }
    }

    h3 {
        font: var(--title);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 2.25) * 0.5em);
        }
    }

    h2 {
        font: var(--headline);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 2) * 0.5em);
        }

        small {
            font: var(--subhead1);
        }
    }

    h1 {
        font: var(--display-1);
        text-align: center;

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 2.5) * 0.5em);
        }
    }

    label {
        font: var(--label);
        color: var(--on-background-variant);

        &::before {
            content: '';
            display: inline-block;
            height: 0;
            width: 0;
            margin-top: calc((1 - 1.25) * 0.5em);
        }

        &:focus-within {
            color: var(--primary)
        }

        span {
            font: var(--subhead1);
            color: var(--on-background);
        }

        pre,
        p,
        h6,
        h5,
        h4,
        h3,
        h2,
        h1 {
            display: block;
            color: var(--on-background);
        }
    }

    fieldset {
        margin: 0;
        padding: 0;
        border: none;
    }

    input::placeholder {
        color: var(--on-background-variant);
    }

    input[type="search"],
    input[type="text"],
    input[type="number"],
    input[type="email"],
    input[type="tel"],
    input[type="date"],
    input[type="time"],
    input[type="password"],
    textarea,
    select {
        display: block;
        width: 100%;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        outline: none;
        background: none;
        border: var(--border-variant);
        font: var(--subhead1);
        color: var(--on-background);
        transition: 0.1s ease-in;
    }

    input[type="search"] {
        height: 3rem;
        padding: 0 1.5rem;
        border-radius: 4px 4px 0 0;
        text-transform: uppercase;
    }

    input[type="number"] {
        width: auto;
        width: 100%;
        text-align: inherit;
        text-transform: uppercase;
    }

    input[type="date"] {
        width: auto;
    }

    textarea {
        resize: none;
    }

    select {
        appearance: none;
        padding: 0.25rem 0.5rem;
        background: rgba(236, 239, 241, 0.7);
        border: 1px solid rgba(0, 0, 0, 0);
    }

    input[type="checkbox"] {
        display: none;
    }
    
    input[type="search"]:hover,
    input[type="text"]:hover,
    input[type="number"]:hover,
    input[type="email"]:hover,
    input[type="tel"]:hover,
    input[type="date"]:hover,
    input[type="time"]:hover,
    input[type="password"]:hover,
    textarea:hover,
    select:hover {
        border: 1px solid var(--primary-variant);
        transition: 0.15s ease-out;
    }

    select:not(:disabled):hover {
        cursor: pointer;
        background: var(--primary-variant);
        border: 1px solid rgba(0, 0, 0, 0);
    }
    
    input[type="search"]:focus,
    input[type="text"]:focus,
    input[type="number"]:focus,
    input[type="email"]:focus,
    input[type="tel"]:focus,
    input[type="date"]:focus,
    input[type="time"]:focus,
    input[type="password"]:focus,
    textarea:focus,
    select:focus {
        outline: none;
        background: var(--primary-variant);
        box-shadow: var(--shadow-variant);
        color: var(--on-background);
        transition: 0.15s ease-out;
    }

    select:focus {
        border: var(--border-primary);
    }

    input[type="search"]:hover,
    input[type="search"]:focus {
        border: none;
        background: none;
    }

    input[type="search"]:disabled,
    input[type="text"]:disabled,
    input[type="number"]:disabled,
    input[type="email"]:disabled,
    input[type="tel"]:disabled,
    input[type="date"]:disabled,
    input[type="time"]:disabled,
    input[type="password"]:disabled,
    textarea:disabled,
    select:disabled {
        pointer-events: none;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--on-background);
        -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
        box-shadow: none;
        border-width: 1px;
        border-style: solid;
        border-color: #2f2f2f;
        border-image: none;
    }

    button,
    input[type="submit"] {
        position: relative;
        padding: 0.5rem 1.5rem;
        border-radius: 4px;
        background: none;
        border: none;
        border: 1px solid rgba(0, 0, 0, 0.3);
        text-transform: uppercase;
        font: var(--body2);
        color: var(--primary);
        transition: 0.1s ease-in;
    }

    button[type="submit"],
    input[type="submit"] {
        color: var(--secondary);
    }

    button[type="reset"] {
        color: var(--error);
    }

    button:hover,
    input[type="submit"]:hover {
        cursor: pointer;
        background: var(--primary-variant);
        transition: 0.15s ease-out;
    }

    button:focus,
    input[type="submit"]:focus {
        outline: none;
    }

    button:disabled,
    input[type="submit"]:disabled {
        cursor: default;
        background: none;
        color: var(--on-background-disabled);
    }
`;

export default GlobalStyle;
