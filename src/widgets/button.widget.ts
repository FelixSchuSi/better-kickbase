import type { FunctionComponent, VNode } from 'preact';
import { html } from 'htm/preact';
import css from './button.widget.css';

export type ButtonProps = { children: VNode[]; icon: string; onClick: () => void };

export const ButtonWidget: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return html`
    <div class=${css.button} onClick=${props.onClick}>
      ${props.children} ${props.icon ? html`<div class="material-icons ${css.icon}">${props.icon}</div>` : ''}
    </div>
  `;
};
