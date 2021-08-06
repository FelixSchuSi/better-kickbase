import type { FunctionComponent, VNode, RefObject } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { html } from 'htm/preact';
import type CSS from 'csstype';

export type BorderProps = { children: VNode[]; direction: CSS.Property.FlexDirection };

export const BkbBorderWidget: FunctionComponent<BorderProps> = ({ children, direction }: BorderProps) => {
  //   const [labelOffset, setLabeloffset] = useState(0);
  const spanContainer: RefObject<HTMLSpanElement> = useRef(null);
  const leftSpan: RefObject<HTMLSpanElement> = useRef(null);
  const centerSpan: RefObject<HTMLSpanElement> = useRef(null);
  const rightSpan: RefObject<HTMLSpanElement> = useRef(null);

  //   useEffect(() => {
  //     const labelHeight: number | undefined = centerSpan.current?.offsetHeight;

  //     const offset: number = labelHeight ? labelHeight / 2 : 0;
  //     console.log(labelHeight, offset);
  //     setLabeloffset(offset);
  //   }, []);

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
      <span ref=${spanContainer} style="${spanStyles}">
        <span ref=${leftSpan} style=${leftStyles}></span>
        <span ref=${centerSpan} style=${centerStyles}> <span style=${labelStyles}>BKB</span> </span>
        <span ref=${rightSpan} style=${rightStyles}></span>
      </span>
      <div style="${styles}">${children}</div>
    </Fragment>
  `;
};
