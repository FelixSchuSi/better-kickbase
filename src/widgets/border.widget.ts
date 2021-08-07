import type { FunctionComponent, VNode } from 'preact';
import { html } from 'htm/preact';
import type CSS from 'csstype';

export type BorderProps = { children: VNode[]; direction: CSS.Property.FlexDirection };

export const BorderWidget: FunctionComponent<BorderProps> = ({ children, direction }: BorderProps) => {
  const styles: CSS.Properties = {
    display: 'flex',
    flexDirection: direction,
    padding: '4px'
  };

  const spanStyles: CSS.Properties = {
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%'
  };

  const spanBase: CSS.Properties = {
    borderTop: '1px solid white',
    borderBottom: '1px solid white'
  };

  const leftStyles: CSS.Properties = {
    ...spanBase,
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px',
    borderLeft: '1px solid white',
    flexGrow: 1
  };

  const centerStyles: CSS.Properties = {
    borderBottom: '1px solid white',
    fontSize: '12px'
  };

  const rightStyles: CSS.Properties = {
    ...spanBase,
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    borderRight: '1px solid white',
    width: '8px'
  };

  const labelStyles: CSS.Properties = {
    position: 'relative',
    top: `-8px`,
    color: 'white',
    paddingLeft: '2px',
    paddingRight: '2px'
  };

  return html`
    <Fragment>
      <span style="${spanStyles}">
        <span style=${leftStyles}></span>
        <span style=${centerStyles}> <span style=${labelStyles}>BKB</span> </span>
        <span style=${rightStyles}></span>
      </span>
      <div style="${styles}">${children}</div>
    </Fragment>
  `;
};
