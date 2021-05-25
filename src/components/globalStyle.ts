import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export const Device = {
    tablet: `(min-width: 768px)`,
    laptop: `(min-width: 1024px)`,
    desktop: `(min-width: 1440px)`,
};

const GlobalStyle = createGlobalStyle`
    ${normalize}
    
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: local('Material Icons'),
            local('MaterialIcons-Regular');
    }

    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;  /* Preferred icon size */
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
        user-select: none;
        vertical-align: middle;
        text-rendering: optimizeLegibility;
    }
    
    /* Rules for sizing the icon. */
    .material-icons.md-18 { font-size: 18px; }
    .material-icons.md-24 { font-size: 24px; }
    .material-icons.md-36 { font-size: 36px; }
    .material-icons.md-48 { font-size: 48px; }

    /* Rules for using icons as black on a light background. */
    .material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
    .material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

    /* Rules for using icons as white on a dark background. */
    .material-icons.md-light { color: rgba(255, 255, 255, 1); }
    .material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }

@font-face {
  font-family: 'Supreme-Variable';
  src: url('./Supreme-Variable.woff2') format('woff2');
       font-weight: 100 800;
       font-display: swap;
       font-style: normal;
}

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: var(--overlay);
    }

    ::-webkit-scrollbar-thumb {
        background: var(--on-background-disabled);
        border: 1px solid var(--on-background-disabled);
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
        font-size: 70%;
	    scroll-behavior: smooth;
    }
    
    body {
        --shadow0: ${(props) => props.theme.shadow0};

        --primary: ${(props) => props.theme.colors.primary};
        --primary-variant: ${(props) => props.theme.colors.primaryVariant};
        --secondary: ${(props) => props.theme.colors.secondary};
        --secondary-variant: ${(props) => props.theme.colors.secondaryVariant};
        --border: ${(props) => props.theme.colors.border};
        --border-variant: ${(props) => props.theme.colors.borderVariant};
        --background: ${(props) => props.theme.colors.background};
        --on-background: ${(props) => props.theme.colors.onBackground};
        --on-background-variant: ${(props) =>
            props.theme.colors.onBackgroundVariant};
        --on-background-disabled: ${(props) =>
            props.theme.colors.onBackgroundDisabled};
        --surface: ${(props) => props.theme.colors.surface};
        --error: ${(props) => props.theme.colors.error};
        --overlay: ${(props) => props.theme.colors.overlay};

        --font-family: "Supreme-Variable";
        --font-family-alt: "Helvetica";

        --label: 300 1.2rem/2rem var(--font-family);
        --body1: 300 1.3rem/2rem var(--font-family);
        --body2: 500 1.3rem/2.4rem var(--font-family);
        --subhead1: 300 1.6rem/2.4rem var(--font-family);
        --subhead2: 500 1.6rem/2.8rem var(--font-family);
        --title: 500 2rem/2.8rem var(--font-family);
        --headline: 300 2.4rem/3.2rem var(--font-family);
        --display-1: 300 3.4rem/4rem var(--font-family);

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-feature-settings: "kern" 1;
        font-kerning: normal;
        background-color: #000;
        color: #fff;
    }

    section {
        overflow-y: overlay;
        display: flex;
        flex-direction: column;
        gap: 20px;
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
        margin: 0;
        padding: 0.8rem;

        pre,
        p,
        h6,
        h5,
        h4,
        h3,
        h2,
        h1 {
            display: inline;
            padding: 0;
            margin-inline-start: 0.8rem;
            color: var(--on-background-variant);
        }
    }

    p {
        font: var(--body1);
    }

    h6 {
        font: var(--body2);
    }

    h5 {
        font: var(--subhead1);
    }

    h4 {
        font: var(--subhead2);
    }

    h3 {
        font: var(--title);
    }

    h2 {
        font: var(--headline);
    }

    h1 {
        font: var(--display-1);
        text-align: center;
    }

    label {
        display: inline-block;
        padding: 12px 20px;
        font: var(--label);

        &:focus-within {
            color: var(--secondary)
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
        padding: 8px 12px;
        outline: none;
        background: none;
        border: none;
        border-bottom: var(--border-variant);
        font: var(--subhead1);
        color: var(--on-background);
        transition: 0.1s ease-in;
    }

    input[type="search"] {
        padding: 12px 16px;
    }

    input[type="number"] {
        width: auto;
        text-align: inherit;
    }

    input[type="date"] {
        width: auto;
    }

    textarea {
        resize: none;
    }

    select:hover {
        cursor: pointer;
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
        border-bottom: var(--border);
        transition: 0.15s ease-out;
    }

    input[type="checkbox"] {
        display:none;
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
        padding: 12px 20px;
        border-radius: 0px;
        background: none;
        border: none;
        text-transform: uppercase;
        font: 500 1.4rem/2rem var(--font-family);
        color: var(--primary);
        transition: 0.1s ease-in;
    }

    button[type="submit"],
    input[type="submit"] {
    }

    button:hover,
    input[type="submit"]:hover {
        cursor: pointer;
        text-decoration: underline;
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
