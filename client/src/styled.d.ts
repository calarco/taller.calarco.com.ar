// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        shadows: {
            surface: string;
            surfaceVariant: string;
        };

        colors: {
            primary: string;
            primaryVariant: string;
            secondary: string;
            secondaryVariant: string;
            border: string;
            borderVariant: string;
            background: string;
            onBackground: string;
            onBackgroundVariant: string;
            onBackgroundDisabled: string;
            surface: string;
            surfaceVariant: string;
            error: string;
            errorVariant: string;
            overlay: string;
        };
    }
}
