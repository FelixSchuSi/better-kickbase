import type { FunctionComponent } from 'react';
import css from './tooltip.widget.css';
import React from 'react';

export type TooltipProps = {
  children: JSX.Element[] | JSX.Element;
  text: string | JSX.Element | JSX.Element[];
  class?: string;
};

export const Tooltip: FunctionComponent<TooltipProps> = (props: TooltipProps) => {
  css;
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <span class={props.class ?? ''} tooltip={props.text}>
      {props.children}
    </span>
  );
};
