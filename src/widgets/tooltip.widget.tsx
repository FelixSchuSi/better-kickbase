import type { FunctionComponent, VNode } from 'preact';
import css from './tooltip.widget.css';

export type TooltipProps = { children: VNode[] | VNode; text: string | VNode | VNode[]; class?: string };

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
