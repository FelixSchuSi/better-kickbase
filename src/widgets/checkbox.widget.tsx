import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import css from './checkbox.widget.css';

export type CheckboxProps = { checked: boolean; id: string; onChange: (id: string, checked: boolean) => void };

export const CheckBox: FunctionComponent<CheckboxProps> = (props: CheckboxProps) => {
  const [checked, setChecked] = useState(props.checked);
  const toggle = () => {
    props.onChange(props.id, !checked);
    setChecked(!checked);
  };

  return (
    <div id={props.id} className={`${css.root} ${checked ? css.checked : ''}`} onClick={toggle}>
      <span className={`${css.tick} material-icons`}> check </span>
    </div>
  );
};
