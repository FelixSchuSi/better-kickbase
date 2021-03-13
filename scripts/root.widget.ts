import { html, render, TemplateResult } from 'lit-html';
import { exportWidget } from './export.widget';
import { reListWidget } from './re-list.widget';

const root = document.createElement('div');
root.classList.add('b-kb-root');
document.body.append(root);

const rootTemplate: TemplateResult = html`
  ${reListWidget} ${exportWidget}
`;

render(rootTemplate, root);
