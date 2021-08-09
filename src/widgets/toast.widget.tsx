import type { FunctionalComponent, VNode } from 'preact';
import type { Ref } from 'preact/hooks';
import { useState, useImperativeHandle } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import css from './toast.widget.css';
import { sleep } from '../helpers/sleep';

export type ToastProps = { children: VNode[]; hideDelay?: number };
export const Toast: FunctionalComponent<ToastProps> = forwardRef((props: ToastProps, ref: Ref<typeof Toast>) => {
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
    <div class={css.fullpage}>
      <div class={`${css.container} ${isShown ? '' : css.hidden}`}>{props.children}</div>
    </div>
  );
});
