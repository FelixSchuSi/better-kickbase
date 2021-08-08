import type { FunctionComponent, VNode } from 'preact';
import { html } from 'htm/preact';
import css from './button.widget.css';

export type ButtonProps = { children: VNode[]; icon?: string; onClick?: () => void; tooltip?: string };

export const ButtonWidget: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const tooltipText: string = props.tooltip ?? '';
  return html`
    <div class=${css.root}>
      <span class=${css.tooltipText}>${tooltipText}</span>
      <span class=${css.arrow}></span>
      <div class=${css.button} onClick=${props.onClick}>
        ${props.children} ${props.icon ? html`<div class="material-icons ${css.icon}">${props.icon}</div>` : ''}
      </div>
    </div>
  `;
};
