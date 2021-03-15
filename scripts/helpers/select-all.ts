import { Selectors } from "./selectors";

export function selectAll<E extends Element>(selector: Selectors, element?: E): NodeListOf<E> {
    return element ? element.querySelectorAll(selector) : document.querySelectorAll(selector);
}