import type { FunctionComponent, VNode } from 'preact';
import { html } from 'htm/preact';
import css from './border.widget.css';
export type BorderProps = { children: VNode[]; direction: string };

export const BorderWidget: FunctionComponent<BorderProps> = ({ children, direction }: BorderProps) => {
  const flexDirection: Record<string, string> = {
    flexDirection: direction
  };

  return html`
    <Fragment>
      <span class=${css.spanStyles}>
        <span class=${css.leftStyles}></span>
        <span class=${css.centerStyles}> <span class=${css.labelStyles}>BKB</span> </span>
        <span class=${css.rightStyles}></span>
      </span>
      <div class=${css.styles} style=${flexDirection}>${children}</div>
    </Fragment>
  `;
};
