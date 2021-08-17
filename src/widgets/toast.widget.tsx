import css from './toast.widget.css';
import { sleep } from '../helpers/sleep';
import type { FunctionComponent } from 'react';
import React, { forwardRef, useState } from 'react';

export type ToastProps = { children: JSX.Element[]; hideDelay?: number; ref: any };
export const Toast: FunctionComponent<ToastProps> = forwardRef((props: ToastProps, ref: any) => {
  const [isShown, setIsShown] = useState(false);
  const hideDelay: number = props.hideDelay ?? 3000;
  const show = async () => {
    setIsShown(true);
    await sleep(hideDelay);
    setIsShown(false);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useImperativeHandle(ref, () => ({
    show
  }));

  return (
    <div className={css.fullpage}>
      <div className={`${css.container} ${isShown ? '' : css.hidden}`}>{props.children}</div>
    </div>
  );
});
