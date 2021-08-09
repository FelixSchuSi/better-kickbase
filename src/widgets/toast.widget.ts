import type { FunctionComponent, VNode } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { html } from 'htm/preact';
import css from './toast.widget.css';

export type ToastProps = { content: VNode; children: VNode[]; onClick: () => void };

export const Toast: FunctionComponent<ToastProps> = (props: ToastProps) => {
  const [label, action] = props.children;
  return html` <div class=${css.root}>${label} ${action}</div> `;
};
