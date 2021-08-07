import type { FunctionComponent, VNode } from 'preact';
import { html } from 'htm/preact';
import type * as CSS from 'csstype';

type Style = CSS.Properties & { [P in CSS.SimplePseudos]?: CSS.Properties };

export type ButtonProps = { children: VNode[]; icon: string };

export const ButtonWidget: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const styles: Style = {
    display: 'flex',
    padding: '4px'
    // '&:hover': {
    //   color: 'red'
    // }
  };
  console.log(props);

  return html`
    <div style="${styles}">
      ${props.children} ${props.icon ? html`<div class="material-icons">${props.icon}</div>` : ''}
    </div>
  `;
};
