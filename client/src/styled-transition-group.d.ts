import { CSSTransition } from "react-transition-group";
import type { StyledInterface } from "styled-components/macro";

declare module "styled-transition-group" {
    const transition: StyledInterface<CSSTransition>;
    export default transition;
}
