import type { FunctionComponent } from 'react';
import React from 'react';
import css from './button.widget.css';

export type ButtonProps = { children?: JSX.Element[] | string; icon?: string; onClick?: () => void; tooltip?: string };

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const tooltipText: string = props.tooltip ?? '';

  return (
    <div className={css.root}>
      {tooltipText === ''
        ? ''
        : [<span className={css.tooltipText}>{tooltipText}</span>, <span className={css.arrow}></span>]}
      <div className={css.button} onClick={props.onClick}>
        {props.children} {props.icon ? <div className={`material-icons ${css.icon}`}>{props.icon}</div> : ''}
      </div>
    </div>
  );
};
