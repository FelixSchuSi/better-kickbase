import type { FunctionComponent, VNode } from 'preact';
import css from './button.widget.css';

export type ButtonProps = { children?: VNode[] | string; icon?: string; onClick?: () => void; tooltip?: string };

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const tooltipText: string = props.tooltip ?? '';

  return (
    <div class={css.root}>
      {tooltipText === '' ? '' : [<span class={css.tooltipText}>{tooltipText}</span>, <span class={css.arrow}></span>]}
      <div class={css.button} onClick={props.onClick}>
        {props.children} {props.icon ? <div class={`material-icons ${css.icon}`}>{props.icon}</div> : ''}
      </div>
    </div>
  );
};
