// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        shadows: {
            surface: string;
            surfaceVariant: string;
        };

        borders: {
            border: string;
            borderVariant: string;
            borderPrimary: string;
        };

        colors: {
            background: string;
            surface: string;
            surfaceT: string;
            surfaceVariant: string;
            primary: string;
            primaryVariant: string;
            secondary: string;
            secondaryVariant: string;
            onBackground: string;
            onBackgroundVariant: string;
            onBackgroundDisabled: string;
            error: string;
            errorVariant: string;
            overlay: string;
        };
    }
}
