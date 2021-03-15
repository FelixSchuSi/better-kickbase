import { Selectors } from "./selectors";

export function select<E extends Element>(selector: Selectors, element?: E): E | null {
    return element ? element.querySelector(selector) : document.querySelector(selector);
}