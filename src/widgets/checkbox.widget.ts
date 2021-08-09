import type { FunctionComponent } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { html } from 'htm/preact';
import css from './checkbox.widget.css';

export type CheckboxProps = { checked: boolean; id: string; onChange: (id: string, checked: boolean) => void };

export const CheckBox: FunctionComponent<CheckboxProps> = (props: CheckboxProps) => {
  const [checked, setChecked] = useState(props.checked);
  const toggle: () => void = useCallback(() => {
    props.onChange(props.id, !checked);
    setChecked(!checked);
  }, [checked]);

  return html`
    <div id=${props.id} class="${css.root} ${checked ? css.checked : ''}" onClick=${toggle}>
      <span class="${css.tick} material-icons"> check </span>
    </div>
  `;
};
